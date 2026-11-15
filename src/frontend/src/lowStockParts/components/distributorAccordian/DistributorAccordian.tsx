import { useFetchDigikey } from '../../../hooks/parts/useFetchDigikey';
import { AccordianMenu } from '../../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../../components/readOnly/ReadOnlyInfoSection';
import { useTheme } from '../../../hooks/userSettings/useSettings';

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
  const themeType = useTheme();
  const { digikeyData, loading, error } = useFetchDigikey(partId);
  const hasDigikeyData = digikeyData?.state === 'ok';

  // Status / loading / error text that spans the whole fields grid
  const messageStyle = {
    gridColumn: '1 / -1',
    color: themeType.textMutedColor,
    fontSize: '13px',
  } as const;

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
            <div style={{ ...messageStyle, color: themeType.errorTextColor }}>
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
              backgroundColor: themeType.surfaceExpandedColor,
              border: `1px solid ${themeType.borderColor}`,
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
                        <span style={{ color: themeType.textMutedColor }}>
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
            borderTop: `1px solid ${themeType.borderColor}`,
          }}
        >
          <div
            style={{
              color: themeType.textMutedColor,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
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
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: themeType.textMutedColor,
                fontWeight: 600,
                fontSize: '12px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = themeType.textPrimaryColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = themeType.textMutedColor)
              }
              onClick={() =>
                digikeyData?.data.productUrl &&
                window.open(digikeyData.data.productUrl, '_blank')
              }
            >
              DigiKey Page ↗
            </button>
            <button
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: themeType.textMutedColor,
                fontWeight: 600,
                fontSize: '12px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = themeType.textPrimaryColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = themeType.textMutedColor)
              }
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
