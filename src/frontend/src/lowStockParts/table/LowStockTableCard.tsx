import { LowStockTableRow } from '../types/lowStockParts';
import { LowStockKebabMenu } from '../kebabMenuActions/LowStockKebabMenu';
import { partTableGrid } from '../../components/table/Table';
import { Chip } from '../../components/chip/Chip';
import { useNavigate } from 'react-router-dom';
import { ExpandableTableCard } from '../../components/table/ExpandableTableCard';
import { LowStockTableDetails } from './LowStockTableDetails';

export interface LowStockTableCardProps {
  lowStockPartData: LowStockTableRow;
}

export function LowStockTableCard({
  lowStockPartData,
}: LowStockTableCardProps) {
  const overflowSectionStyle = {
    paddingInline: '2%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };
  const nav = useNavigate();

  return (
    <ExpandableTableCard
      key={lowStockPartData.partId}
      tableCardGrid={partTableGrid}
      cardContent={
        <>
          <div
            style={{
              gridColumn: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              ...overflowSectionStyle,
            }}
          >
            <td
              style={{
                borderLeft: '2px solid transparent',
                ...overflowSectionStyle,
              }}
            >
              {lowStockPartData.name}
            </td>
            <Chip />
          </div>
          <td
            style={{
              gridColumn: 2,
              borderLeft: '2px solid transparent',
              ...overflowSectionStyle,
            }}
          >
            {lowStockPartData.description}
          </td>
          <td
            style={{
              gridColumn: 3,
              borderLeft: '2px solid transparent',
              ...overflowSectionStyle,
            }}
          >
            {lowStockPartData.comment}
          </td>
          <td
            style={{
              gridColumn: 4,
              borderLeft: '2px solid transparent',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {lowStockPartData.stockLevel}
          </td>
          <td
            style={{
              gridColumn: 5,
              borderLeft: '2px solid transparent',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            ${Number(lowStockPartData.averagePrice.toString().slice(0, -2))}
          </td>
          <td
            style={{
              gridColumn: 6,
              borderLeft: '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
              gap: '2%',
            }}
          >
            <button
              style={{
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#b8b8b8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Add to Cart
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <LowStockKebabMenu
                partId={lowStockPartData.partId}
                partURL={lowStockPartData.partURL}
              />
            </div>
          </td>
        </>
      }
      expandedContent={
        <LowStockTableDetails partId={lowStockPartData.partId} />
      }
    />
  );
}
