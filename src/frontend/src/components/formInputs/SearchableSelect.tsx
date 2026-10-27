import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { FormInputOption } from '../form/FormInputProps';

export interface SearchableSelectProps {
  label: string;
  options: FormInputOption[];
  // The selected option's value, or null / '' / undefined when nothing is selected
  value: string | number | null | undefined;
  // Called with the chosen option's value, or null when the selection is cleared
  onChange: (value: string | number | null) => void;
  // Text of the first row, which clears the selection (e.g. "Not set")
  placeholderOption?: string;
  required?: boolean;
  inputWidth?: number; // by percentage, same as FormInputs
  disabled?: boolean;
  inputErrors?: React.ReactNode;
}

// One row in the list. value === null is the "clear the selection" row.
interface Row {
  value: string | number | null;
  label: string;
}

// A drop-in replacement for FormInputs' select that you can type into to filter
// the options. It is a controlled component, so with react-hook-form wrap it in
// <Controller> (see AddNewPartForm).
//
// Keyboard: type to filter, Up/Down to move, Enter to pick, Escape to close the
// list (the first Escape only closes the list, it does not close the modal).
export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholderOption = 'None',
  required,
  inputWidth,
  disabled,
  inputErrors,
}: SearchableSelectProps) {
  const id = useId();
  const listId = `${id}-list`;

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  // Values can be numbers or strings, so compare them as strings
  const selected = options.find((o) => String(o.value) === String(value));

  // The rows to show: every option that contains the typed text. The "clear" row
  // is only shown while the box is empty.
  const rows: Row[] = useMemo(() => {
    const text = query.trim().toLowerCase();
    const matches = options.filter((o) => o.label.toLowerCase().includes(text));
    return text === ''
      ? [{ value: null, label: placeholderOption }, ...matches]
      : matches;
  }, [options, query, placeholderOption]);

  const closeList = () => {
    setOpen(false);
    setQuery('');
  };

  const choose = (row: Row | undefined) => {
    if (!row) return;
    onChange(row.value);
    closeList();
  };

  // Close when clicking anywhere outside the component
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  // Keep the highlighted row visible when moving with the arrow keys
  useEffect(() => {
    if (!open) return;
    const row = listRef.current?.children[highlighted] as
      | HTMLElement
      | undefined;
    // scrollIntoView does not exist in jsdom (Jest), hence the ?.
    row?.scrollIntoView?.({ block: 'nearest' });
  }, [highlighted, open]);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    // Start on the currently selected row, or the first row
    const index = rows.findIndex((r) => String(r.value) === String(value));
    setHighlighted(index === -1 ? 0 : index);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openList();
        else setHighlighted((h) => Math.min(h + 1, rows.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openList();
        else setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
        // Never let Enter submit the form from this box
        e.preventDefault();
        if (open) choose(rows[highlighted]);
        break;
      case 'Escape':
        if (open) {
          // Only close the list - don't let the Modal's Escape handler see it
          e.stopPropagation();
          closeList();
        }
        break;
      case 'Tab':
        closeList();
        break;
    }
  };

  const width = inputWidth ? `${inputWidth}%` : '50%';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontSize: '12px',
      }}
    >
      <label htmlFor={id}>
        {label}
        {required && <span style={{ color: '#d36a6a' }}> *</span>}
      </label>

      {/* +14px so it lines up with the other inputs, which add padding + border
          on top of their width */}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: `calc(${width} + 14px)` }}
      >
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && rows.length > 0 ? `${id}-row-${highlighted}` : undefined
          }
          autoComplete="off"
          disabled={disabled}
          // While the list is open show what the user is typing, otherwise show
          // the selected option's label
          value={open ? query : (selected?.label ?? '')}
          placeholder={open ? 'Type to search...' : placeholderOption}
          onFocus={openList}
          onClick={openList}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onKeyDown={onKeyDown}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#ebebeb',
            color: '#1a1a1a',
            border: inputErrors ? '2px solid #4f0000' : '2px solid #a3a3a3',
            borderRadius: '5px',
            padding: '5px 24px 5px 5px',
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#555',
            pointerEvents: 'none',
            fontSize: '10px',
          }}
        >
          ▼
        </span>

        {open && (
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 10,
              margin: '2px 0 0',
              padding: 0,
              listStyle: 'none',
              maxHeight: '180px',
              overflowY: 'auto',
              backgroundColor: '#ebebeb',
              color: '#1a1a1a',
              border: '2px solid #a3a3a3',
              borderRadius: '5px',
              boxShadow: '0 4px 12px #00000066',
            }}
          >
            {rows.length === 0 && (
              <li style={{ padding: '6px 8px', color: '#666' }}>
                No matching options
              </li>
            )}
            {rows.map((row, index) => {
              const isSelected =
                row.value === null
                  ? selected === undefined
                  : String(row.value) === String(value);
              return (
                <li
                  key={row.value ?? '__none__'}
                  id={`${id}-row-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  // mousedown (not click) + preventDefault so the input keeps
                  // focus and the outside-click handler isn't triggered
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(row);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                  style={{
                    padding: '6px 8px',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 400,
                    fontStyle: row.value === null ? 'italic' : 'normal',
                    backgroundColor:
                      index === highlighted ? '#cfcfcf' : 'transparent',
                  }}
                >
                  {row.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {inputErrors}
    </div>
  );
}
