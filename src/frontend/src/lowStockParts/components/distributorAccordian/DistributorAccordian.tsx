import { useFetchDigikey } from '../../../data/hooks/parts/useFetchDigikey';
import { AccordianMenu } from '../../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../../components/readOnly/ReadOnlyInfoSection';
import {
  useSettings,
  useTheme,
} from '../../../data/hooks/userSettings/useSettings';
import { capitalizeString } from '../../../functions';

interface DistributorAccordianProps {
  partId: number;
  name: string;
  partNumber: string;
  productUrl: string;
}

export function DistributorAccordian({
  partId,
  name,
  partNumber,
  productUrl,
}: DistributorAccordianProps) {
  const themeType = useTheme();
  const { settings } = useSettings();
  const { digikeyData, loading, error } = useFetchDigikey(
    partId,
    settings.distributorLookups,
  );
  const hasDigikeyData = digikeyData?.state === 'ok';
  const formattedName = capitalizeString(name);

  // The page link is the one saved on the part, so it shows even without DigiKey data;
  // DigiKey's own link is only a fallback. The datasheet only comes from DigiKey.
  const pageUrl =
    productUrl ||
    (digikeyData?.state === 'ok' ? digikeyData.data.productUrl : null);
  const datasheetUrl =
    digikeyData?.state === 'ok' ? digikeyData.data.datasheetUrl : null;

  // Status / loading / error text that spans the whole fields grid
  const messageStyle = {
    gridColumn: '1 / -1',
    color: themeType.textMutedColor,
    fontSize: '13px',
  } as const;

  return (
    <AccordianMenu
      title={`${formattedName} Information`}
      sideTitleSection={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: 'none',
              color: themeType.textMutedColor,
              cursor: 'pointer',
            }}
            onClick={() => {}}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = themeType.textPrimaryColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = themeType.textMutedColor)
            }
          >
            x
          </button>
        </div>
      }
    >
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
            title="Distributor Name"
            information={formattedName}
          />
          <ReadOnlyInfoSection
            title="Distributor Part Number"
            information={partNumber}
          />

          {(!settings.distributorLookups ||
            digikeyData?.state === 'disabled') && (
            <div style={messageStyle}>DigiKey lookups are turned off.</div>
          )}
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

      {(pageUrl || datasheetUrl) && (
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
            {pageUrl && (
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
                onClick={() => window.open(pageUrl, '_blank')}
              >
                {formattedName} Page ↗
              </button>
            )}
            {datasheetUrl && (
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
                onClick={() => window.open(datasheetUrl, '_blank')}
              >
                {partNumber} Datasheet ↗
              </button>
            )}
          </div>
        </div>
      )}
    </AccordianMenu>
  );
}
