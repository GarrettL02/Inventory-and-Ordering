import { useId } from 'react';

export interface FormInputOption {
  value: string | number;
  label: string;
}

export interface FormInputsProps {
  label: string;
  inputType?: string; // 'textarea' | 'select' | any <input type>
  inputParams: object;
  inputErrors?: React.ReactNode;
  inputWidth?: number; // by percentage
  inputHeight?: number; // in pixels
  required?: boolean; // shows a * next to the label
  step?: number | string; // for number inputs, e.g. "any" or 0.01
  min?: number;
  options?: FormInputOption[]; // for inputType="select"
  placeholderOption?: string; // empty first option for selects, e.g. "None"
}
export function FormInputs({
  label,
  inputType,
  inputParams,
  inputErrors,
  inputWidth,
  inputHeight,
  required,
  step,
  min,
  options,
  placeholderOption,
}: FormInputsProps) {
  const id = useId();

  const sharedStyles = {
    backgroundColor: '#ebebeb',
    border: inputErrors ? '2px solid #4f0000' : '2px solid #a3a3a3',
    borderRadius: '5px',
    padding: '5px',
    width: inputWidth ? `${inputWidth}%` : '50%',
    height: inputHeight ? inputHeight : '',
  };

  let field: React.ReactNode;
  if (inputType === 'textarea') {
    field = <textarea id={id} style={{ ...sharedStyles }} {...inputParams} />;
  } else if (inputType === 'select') {
    field = (
      <select id={id} style={{ ...sharedStyles }} {...inputParams}>
        <option value="">{placeholderOption ?? 'None'}</option>
        {(options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    field = (
      <input
        id={id}
        style={{ ...sharedStyles }}
        {...inputParams}
        type={inputType || ''}
        step={step}
        min={min}
      />
    );
  }

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
      {field}
      {inputErrors}
    </div>
  );
}
