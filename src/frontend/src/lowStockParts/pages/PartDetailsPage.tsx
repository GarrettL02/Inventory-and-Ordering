import { useLoaderData } from 'react-router-dom';
import { BackButton } from '../../components/buttons/backButton/BackButton';
import { useEffect } from 'react';
import { useFetchPartsById } from '../../hooks/parts/useFetchPartsById';
import { DataValidationStateWrapper } from '../../components/dataValidationStateWrapper/DataValidationStateWrapper';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../components/readOnly/ReadOnlyInfoSection';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { DistributorAccordian } from '../components/distributorAccordian/DistributorAccordian';
import { StockHistorySection } from '../../partLookup/components/StockHistorySection';
import { PartImageSection } from '../../partLookup/components/PartImageSection';
import { ManufacturerAccordian } from '../components/manufacturerAccordian/ManufacturerAccordian';
import { useTheme } from '../../hooks/userSettings/useSettings';
import { WarningIcon } from '../../components/icons/WarningIcon';
import { CurrentStockComponent } from '../components/currentStockComponent/CurrentStockComponent';

// Big heading that starts each of the two page sections
const sectionHeadingStyle = {
  fontSize: '22px',
  fontWeight: 600,
  margin: 0,
  paddingBottom: '10px',
} as const;

export function PartDetailsPage() {
  const themeType = useTheme();
  const { partId } = useLoaderData() as { partId: number };
  const { parts, loading, error, refetch } = useFetchPartsById(partId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        color: themeType.textPrimaryColor,
        minHeight: '100dvh',
        paddingTop: '20px',
        paddingLeft: '25px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        marginBottom: '70px',
      }}
    >
      <DataValidationStateWrapper error={error} loading={loading}>
        <>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <BackButton />
            </div>
            <section style={{ marginTop: '30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${themeType.borderColor}`,
                }}
              >
                <h1 style={sectionHeadingStyle}>Part Details</h1>
                <button
                  style={{
                    background: 'none',
                    color: themeType.textPrimaryColor,
                    cursor: 'pointer',
                  }}
                >
                  + Edit Part
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1 style={{ margin: '24px 0 20px' }}>{parts?.name}</h1>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr .7fr',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <AccordianMenu title="Part Information">
                    {/**------------ Accordian Row 1 ------------ **/}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 2fr',
                        columnGap: '40px',
                      }}
                    >
                      <div
                        style={{
                          gridColumn: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                        }}
                      >
                        <ReadOnlyInfoSection
                          title={'Description'}
                          information={parts?.description}
                        />
                        <ReadOnlyInfoSection
                          title={'Comments'}
                          information={parts?.comment}
                        />
                      </div>
                      {/**------------ Numbers and location ------------ **/}
                      <div
                        style={{
                          display: 'grid',
                          gridColumn: 2,
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          columnGap: '20px',
                          rowGap: '20px',
                          alignContent: 'start',
                        }}
                      >
                        <ReadOnlyInfoSection
                          title={'Current Stock Level'}
                          information={
                            <CurrentStockComponent
                              stockLevel={parts?.stockLevel}
                              minStockLevel={parts?.minStockLevel}
                            />
                          }
                        />
                        <ReadOnlyInfoSection
                          title={'Minimum Stock Level'}
                          information={parts?.minStockLevel}
                        />
                        <ReadOnlyInfoSection
                          title={'Average Price'}
                          information={
                            parts ? `$${parts.averagePrice}` : undefined
                          }
                        />
                        <ReadOnlyInfoSection
                          title={'Storage Location'}
                          information={parts?.storageLocationName}
                        />
                      </div>
                    </div>
                  </AccordianMenu>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    <PartImageSection
                      partId={partId}
                      partName={parts?.name ?? ''}
                      filename={parts?.filename}
                      onChanged={refetch}
                    />
                    <ManufacturerAccordian
                      manufacturerName={parts?.manufacturerName}
                      manufacturerPartNumber={parts?.manufacturerPartNumber}
                    />
                  </div>
                </div>
                <StockHistorySection
                  partId={partId}
                  stockLevel={parts?.stockLevel || 0}
                  onStockChanged={refetch}
                />
              </div>
            </section>

            {/**================ Distributor Details section ================**/}
            <section style={{ marginTop: '30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${themeType.borderColor}`,
                }}
              >
                <h1 style={sectionHeadingStyle}>Distributor(s) Details</h1>
                <button
                  style={{
                    background: 'none',
                    color: themeType.textPrimaryColor,
                    cursor: 'pointer',
                  }}
                >
                  + Add Distributor
                </button>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                {parts?.manufacturerPartNumber && (
                  <DistributorAccordian
                    partId={parts.id}
                    partNumber={parts?.manufacturerPartNumber}
                    distributorName={parts?.manufacturerName}
                  />
                )}
              </div>
            </section>
          </div>
        </>
      </DataValidationStateWrapper>
    </div>
  );
}
