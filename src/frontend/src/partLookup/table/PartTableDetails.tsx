import { useNavigate } from 'react-router-dom';
import { useFetchPartsById } from '../../hooks/parts/useFetchPartsById';
import { TableDataDropFields } from '../../components/table/TableDataDropFields';
import { StockChangeComponent } from '../../components/stockChange/StockChangeComponent';
import { partImageUrl } from '../../services/parts/partsService';
import { ImageLightboxComponent } from '../../components/lightBox/ImageLightboxComponent';
import { useTheme } from '../../hooks/userSettings/useTheme';

export interface PartCardDetailsProps {
  partId: number;
  // Called after this part's stock was changed, so the page can refresh the table row
  onStockChanged?: () => void;
}

export function PartCardDetails({
  partId,
  onStockChanged,
}: PartCardDetailsProps) {
  const themeType = useTheme();
  const { parts, loading, error, refetch } = useFetchPartsById(partId);
  const partImgSrc = partImageUrl(partId, parts?.filename);
  const nav = useNavigate();

  if (loading)
    return (
      <div style={{ fontSize: '13px', color: themeType.textMutedColor }}>
        Loading part details...
      </div>
    );
  if (error || !parts)
    return (
      <div style={{ fontSize: '13px', color: themeType.errorTextColor }}>
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
        <StockChangeComponent
          partId={partId}
          stockLevel={parts.stockLevel}
          onChanged={() => {
            refetch(); // the numbers in this details panel
            onStockChanged?.(); // the Stock Level column in the table row
          }}
        />
        {partImgSrc && (
          <ImageLightboxComponent
            imageSrc={partImgSrc}
            imageAlt={`Image of ${parts.name}`}
            filename={parts.filename}
          />
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => nav(`/inventory/${partId}`)}
          style={{
            background: 'transparent',
            border: 'none',
            color: themeType.textPrimaryColor,
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
              color: themeType.textPrimaryColor,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              padding: 0,
            }}
          >
            Product Page
          </button>
        )}
      </div>
    </div>
  );
}
