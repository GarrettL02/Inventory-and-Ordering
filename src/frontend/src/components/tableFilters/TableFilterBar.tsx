export interface FilterOption {
  label: string;
  key: string;
  options: { label: string; value: string }[];
  gridColumn: number; // which column to sit over
}

interface TableFilterBarProps {
  filters?: FilterOption[];
  onFilterChange?: (key: string, value: string) => void;
  onSearchChange?: (value: string) => void;
  tableGrid: string; // same grid as the table
  totalColumns: number; // so search bar knows where to go
}

export function TableFilterBar({
  filters,
  onFilterChange,
  onSearchChange,
  tableGrid,
}: TableFilterBarProps) {
  const themeType = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: themeType.filterBarBackgroundColor,
      }}
    >
      {/* filters aligned to table grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: tableGrid,
          alignItems: 'center',
          gap: '4px',
          paddingBlock: '10px',
          paddingInline: '10px',
          flex: 1, // takes remaining space
        }}
      >
        {filters?.map((filter) => (
          <select
            key={filter.key}
            defaultValue=""
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            style={{
              gridColumn: filter.gridColumn,
              border: `2px solid ${themeType.compactInputBorderColor}`,
              borderRadius: '12px',
              paddingInline: '10px',
              paddingBlock: '10px',
              backgroundColor: themeType.compactInputBackgroundColor,
              fontSize: '12px',
              color: themeType.compactInputTextColor,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* search bar fixed width, completely separate */}
      <div
        style={{ display: 'flex', alignItems: 'center', paddingInline: '10px' }}
      >
        <input
          style={{
            width: '200px',
            background: 'none',
            border: `2px solid ${themeType.compactInputBorderColor}`,
            borderRadius: '10px',
            backgroundColor: themeType.compactInputBackgroundColor,
            color: themeType.compactInputTextColor,
            paddingInline: '15px',
            paddingBlock: '10px',
          }}
          type="search"
          placeholder="Search..."
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
import { useTheme } from '../../hooks/userSettings/useTheme';
