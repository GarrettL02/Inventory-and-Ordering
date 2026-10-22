import { useNavigate } from 'react-router-dom';
import { useFetchPartsById } from '../hooks/useFetchPartsById';
import { TableDataDropFields } from '../../components/table/TableDataDropFields';
import { useState } from 'react';

export interface PartCardDetailsProps {
  partId: number;
}

export function PartCardDetails({ partId }: PartCardDetailsProps) {
  const { parts, loading, error } = useFetchPartsById(partId);
  const nav = useNavigate();
  const [stockAmount, setStockAmount] = useState('1');

  if (loading)
    return <div style={{ fontSize: '13px' }}>Loading part details...</div>;
  if (error || !parts)
    return (
      <div style={{ fontSize: '13px' }}>
        Error loading part details: {error}
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 5-Column Master Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: '16px',
        }}
      >
        {/* Row 1: Top 5 fields */}
        <TableDataDropFields
          label="Part Number"
          value={parts.internalPartNumber}
        />
        <TableDataDropFields
          label="Storage Location"
          value={parts.storageLocationName}
        />
        <TableDataDropFields
          label="Manufacturer"
          value={parts.manufacturerName}
        />
        <TableDataDropFields
          label="Manufacturer Part Number"
          value={parts.manufacturerPartNumber}
        />
        <TableDataDropFields label="Price" value={`$${parts.averagePrice}`} />

        {/* Row 2: Description (spans columns 1–3) & Stock Controls (Column 5) */}
        <div style={{ gridColumn: 'span 3' }}>
          <TableDataDropFields label="Description" value={parts.description} />
        </div>
        <TableDataDropFields
          label="Current Stock Level"
          value={parts.stockLevel}
        />
        <TableDataDropFields
          label="Minimum Stock Level"
          value={parts.minStockLevel}
        />

        {/* Row 3: Comments (spans full width) */}
        <div style={{ gridColumn: 'span 3' }}>
          <TableDataDropFields label="Comments" value={parts.comment} />
        </div>
        <div
          style={{
            gridColumn: 'span 2',
            display: 'flex',
            gap: '10px',
            height: '20px',
          }}
        >
          <input
            type="number"
            min={1}
            max={parts.stockLevel}
            step={1}
            style={{
              borderRadius: '5px',
              paddingInline: '6px',
              width: '60px',
              fontSize: '12px',
            }}
            value={stockAmount}
            onChange={(e) => setStockAmount(e.target.value)}
            onBlur={() => {
              // If they clear it or type something invalid, snap back to 1
              if (
                !stockAmount ||
                Number(stockAmount) < 1 ||
                Number(stockAmount) > parts.stockLevel
              )
                setStockAmount('1');
            }}
          />
          <button
            disabled={parts.stockLevel === 0}
            style={{
              borderRadius: '5px',
              paddingInline: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#000000',
              backgroundColor: '#e1e1e1',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#8c8c8c')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#e1e1e1')
            }
          >
            Remove Stock
          </button>
          <button
            style={{
              borderRadius: '5px',
              paddingInline: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#000000',
              backgroundColor: '#e1e1e1',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#8c8c8c')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#e1e1e1')
            }
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => nav(`/parts/unordered/${partId}`)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
            padding: 0,
          }}
        >
          Open full page
        </button>
        {parts.partURL && (
          <button
            onClick={() => window.open(parts.partURL!, '_blank')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              padding: 0,
            }}
          >
            {parts.manufacturerName ?? 'Manufacturer'} Page
          </button>
        )}
      </div>
    </div>
  );
}
