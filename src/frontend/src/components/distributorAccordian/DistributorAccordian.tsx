import { useFetchDigikey } from '../../partLookup/hooks/useFetchDigikey';
import { AccordianMenu } from '../accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../readOnly/ReadOnlyInfoSection';

interface DistributorAccordianProps {
  partId: number;
  distributorName?: string | null;
  partNumber?: string | null;
}

export function DistributorAccordian({
  partId,
  distributorName,
  partNumber,
}: DistributorAccordianProps) {
  const { digikeyData, loading, error } = useFetchDigikey(partId);

  return (
    <AccordianMenu title="Distributor Information" shrinkable>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left: info fields, 2 columns */}
        <div
          style={{
            flex: 4,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: '40px',
          }}
        >
          <ReadOnlyInfoSection
            title="Manufacturer"
            information={distributorName}
          />
          <ReadOnlyInfoSection
            title="Manufacturer Part Number"
            information={partNumber}
          />

          {loading && <div>Loading DigiKey data...</div>}
          {error && <div>Could not load DigiKey data.</div>}
          {digikeyData?.state === 'unavailable' && (
            <div>{digikeyData.message}</div>
          )}
          {digikeyData?.state === 'no-part-number' && (
            <div>Add a manufacturer part number to see DigiKey data.</div>
          )}
          {digikeyData?.state === 'not-found' && (
            <div>DigiKey has no exact match for this part number.</div>
          )}
          {digikeyData?.state === 'ok' && (
            <>
              <ReadOnlyInfoSection
                title="Status (DigiKey)"
                information={digikeyData.data.status}
              />
              <ReadOnlyInfoSection
                title="Qty Available (DigiKey)"
                information={digikeyData.data.quantityAvailable}
              />
            </>
          )}
        </div>
        {digikeyData?.state === 'ok' && (
          <div style={{ flex: 1 }}>
            <ReadOnlyInfoSection
              title="Price (DigiKey)"
              information={
                digikeyData.data.priceBreaks.length > 0
                  ? digikeyData.data.priceBreaks.map((units) => (
                      <div key={units.quantity} style={{ marginBottom: '5px' }}>
                        {units.quantity}:{' '}
                        {units.unitPrice ? `$${units.unitPrice}` : '—'}
                      </div>
                    ))
                  : undefined
              }
            />
          </div>
        )}
      </div>
      {digikeyData?.state === 'ok' && (
        <>
          <div style={{ marginTop: '40px', fontWeight: 600 }}>Links</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 3fr',
              marginTop: '10px',
              justifyItems: 'start',
            }}
          >
            <button
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#9c9c9c',
                fontWeight: 600,
                fontSize: '12px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9c9c9c')}
              onClick={() =>
                digikeyData?.data.productUrl &&
                window.open(digikeyData.data.productUrl, '_blank')
              }
            >
              DigiKey Page
            </button>
            <button
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#9c9c9c',
                fontWeight: 600,
                fontSize: '12px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9c9c9c')}
              onClick={() =>
                digikeyData?.data.datasheetUrl &&
                window.open(digikeyData.data.datasheetUrl, '_blank')
              }
            >
              {partNumber} Datasheet
            </button>
          </div>
        </>
      )}
    </AccordianMenu>
  );
}
