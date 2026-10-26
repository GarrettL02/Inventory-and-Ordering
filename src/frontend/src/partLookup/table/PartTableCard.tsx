import { useState } from 'react';
import { partTableGrid } from '../../components/table/Table';
import { PartTableData } from '../types/Part';
import { LowStockKebabMenu } from '../../lowStockParts/kebabMenuActions/LowStockKebabMenu';
import { ExpandableTableCard } from '../../components/table/ExpandableTableCard';
import { PartCardDetails } from './PartTableDetails';
import { ConfirmDeletePartModal } from '../forms/ConfirmDeletePartModal';

export interface LowStockTableCardProps {
  partData: PartTableData;
  // Called after this part was deleted, so the page can refresh its table
  onDeleted?: () => void;
  // Called after this part's stock was changed, so the page can refresh its table
  onStockChanged?: () => void;
}

export function PartTableCard({
  partData,
  onDeleted,
  onStockChanged,
}: LowStockTableCardProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const overflowSectionStyle = {
    paddingInline: '2%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <ExpandableTableCard
      key={partData.id}
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
              {partData.name}
            </td>
          </div>
          <td
            style={{
              gridColumn: 2,
              borderLeft: '2px solid transparent',
              ...overflowSectionStyle,
            }}
          >
            {partData.description}
          </td>
          <td
            style={{
              gridColumn: 3,
              borderLeft: '2px solid transparent',
              ...overflowSectionStyle,
            }}
          >
            {partData.comment}
          </td>
          <td
            style={{
              gridColumn: 4,
              borderLeft: '2px solid transparent',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {partData.stockLevel}
          </td>
          <td
            style={{
              gridColumn: 5,
              borderLeft: '2px solid transparent',
              display: 'flex',
            }}
          >
            {partData.storageLocation}
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
            <div onClick={(e) => e.stopPropagation()}>
              <LowStockKebabMenu
                partId={partData.id}
                partURL={''}
                onDelete={() => setConfirmDeleteOpen(true)}
              />
              {confirmDeleteOpen && (
                <ConfirmDeletePartModal
                  partId={partData.id}
                  partName={partData.name}
                  onClose={() => setConfirmDeleteOpen(false)}
                  onDeleted={onDeleted}
                />
              )}
            </div>
          </td>
        </>
      }
      expandedContent={
        <PartCardDetails
          partId={partData.id}
          onStockChanged={onStockChanged}
        />
      }
    />
  );
}
