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
  return (
    <div style={{ display: 'flex', backgroundColor: '#181818ff' }}>
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
              border: '2px solid #ccc',
              borderRadius: '12px',
              paddingInline: '10px',
              paddingBlock: '10px',
              backgroundColor: 'rgb(19, 19, 19)',
              fontSize: '12px',
              color: '#a8a8a8',
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
            border: '2px solid #ccc',
            borderRadius: '10px',
            color: '#ffffff',
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
