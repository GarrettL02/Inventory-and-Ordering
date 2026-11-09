import { useFetchDigikey } from '../../../hooks/parts/useFetchDigikey';
import { AccordianMenu } from '../../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../../components/readOnly/ReadOnlyInfoSection';

interface DistributorAccordianProps {
  partId: number;
  distributorName?: string | null;
  partNumber?: string | null;
}

// Status / loading / error text that spans the whole fields grid
const messageStyle = {
  gridColumn: '1 / -1',
  color: '#a7a7a7',
  fontSize: '13px',
} as const;

const linkButtonStyle = {
  backgroundColor: '#ffffff12',
  border: '1px solid #3d3d3d',
  borderRadius: '8px',
  color: '#cfcfcf',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 600,
  padding: '6px 12px',
} as const;

const setLinkHover = (el: HTMLButtonElement, hovering: boolean) => {
  el.style.backgroundColor = hovering ? '#ffffff22' : '#ffffff12';
  el.style.color = hovering ? '#ffffff' : '#cfcfcf';
};

export function DistributorAccordian({
  partId,
  distributorName,
  partNumber,
}: DistributorAccordianProps) {
  const { digikeyData, loading, error } = useFetchDigikey(partId);
  const hasDigikeyData = digikeyData?.state === 'ok';

  return (
    <AccordianMenu title="Distributor Information" shrinkable>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasDigikeyData
            ? 'minmax(0, 2fr) minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: info fields, 2 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: '20px',
            rowGap: '20px',
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

          {loading && <div style={messageStyle}>Loading DigiKey data...</div>}
          {error && (
            <div style={{ ...messageStyle, color: '#ef5350' }}>
              Could not load DigiKey data.
            </div>
          )}
          {digikeyData?.state === 'unavailable' && (
            <div style={messageStyle}>{digikeyData.message}</div>
          )}
          {digikeyData?.state === 'no-part-number' && (
            <div style={messageStyle}>
              Add a manufacturer part number to see DigiKey data.
            </div>
          )}
          {digikeyData?.state === 'not-found' && (
            <div style={messageStyle}>
              DigiKey has no exact match for this part number.
            </div>
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

        {/* Right: price breaks in their own panel */}
        {digikeyData?.state === 'ok' && (
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '14px 16px',
            }}
          >
            <ReadOnlyInfoSection
              title="Price (DigiKey)"
              information={
                digikeyData.data.priceBreaks.length > 0
                  ? digikeyData.data.priceBreaks.map((units) => (
                      <div
                        key={units.quantity}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '16px',
                          padding: '3px 0',
                        }}
                      >
                        <span style={{ color: '#a7a7a7' }}>
                          {units.quantity}
                        </span>
                        <span>
                          {units.unitPrice ? `$${units.unitPrice}` : '—'}
                        </span>
                      </div>
                    ))
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {digikeyData?.state === 'ok' && (
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #333333',
          }}
        >
          <div style={{ color: '#a7a7a7', fontSize: '12px', fontWeight: 500 }}>
            Links
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            <button
              style={linkButtonStyle}
              onMouseEnter={(e) => setLinkHover(e.currentTarget, true)}
              onMouseLeave={(e) => setLinkHover(e.currentTarget, false)}
              onClick={() =>
                digikeyData?.data.productUrl &&
                window.open(digikeyData.data.productUrl, '_blank')
              }
            >
              DigiKey Page ↗
            </button>
            <button
              style={linkButtonStyle}
              onMouseEnter={(e) => setLinkHover(e.currentTarget, true)}
              onMouseLeave={(e) => setLinkHover(e.currentTarget, false)}
              onClick={() =>
                digikeyData?.data.datasheetUrl &&
                window.open(digikeyData.data.datasheetUrl, '_blank')
              }
            >
              {partNumber} Datasheet ↗
            </button>
          </div>
        </div>
      )}
    </AccordianMenu>
  );
}
