import { useLoaderData } from 'react-router-dom';
import { BackButton } from '../../components/buttons/backButton/BackButton';
import { useEffect } from 'react';
import { useFetchPartsById } from '../../partLookup/hooks/useFetchPartsById';
import { DataValidationStateWrapper } from '../../components/dataValidationStateWrapper/DataValidationStateWrapper';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../components/readOnly/ReadOnlyInfoSection';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { DistributorAccordian } from '../../components/distributorAccordian/DistributorAccordian';
import { StockHistorySection } from '../../partLookup/components/StockHistorySection';

export function PartDetailsPage() {
  const { partId } = useLoaderData() as { partId: number };
  const { parts, loading, error, refetch } = useFetchPartsById(partId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        color: '#ffffff',
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h1 style={{ color: '#ffffff' }}>{parts?.name}</h1>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr .5fr ',
                gap: '20px',
              }}
            >
              <div>
                <AccordianMenu title="Part Information" shrinkable>
                  {/**------------ Accordian Row 1 ------------ **/}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1fr 1fr',
                      marginBottom: '50px',
                    }}
                  >
                    <div style={{ gridColumn: 1 }}>
                      <ReadOnlyInfoSection
                        title={'Description'}
                        information={parts?.description}
                      />
                    </div>
                    <div style={{ gridColumn: 2 }}>
                      <ReadOnlyInfoSection
                        title={'Current Stock Level'}
                        information={parts?.stockLevel}
                      />
                    </div>
                    <div style={{ gridColumn: 3 }}>
                      <ReadOnlyInfoSection
                        title={'Minimum Stock Level'}
                        information={parts?.minStockLevel}
                      />
                    </div>
                  </div>
                  {/**------------ Accordian Row 2 ------------ **/}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1fr 1fr',
                    }}
                  >
                    <div style={{ gridColumn: 1 }}>
                      <ReadOnlyInfoSection
                        title={'Comments'}
                        information={parts?.comment}
                      />
                    </div>
                    <div style={{ gridColumn: 2 }}>
                      <ReadOnlyInfoSection
                        title={'Average Price'}
                        information={`$${parts?.averagePrice} (1)`}
                      />
                    </div>
                    <div style={{ gridColumn: 3 }}>
                      <ReadOnlyInfoSection
                        title={'Storage Location'}
                        information={parts?.storageLocationName}
                      />
                    </div>
                  </div>
                </AccordianMenu>
                {parts?.manufacturerPartNumber && (
                  <DistributorAccordian
                    partId={parts.id}
                    partNumber={parts?.manufacturerPartNumber}
                    distributorName={parts?.manufacturerName}
                  />
                )}
                <AccordianMenu title="Attachments" shrinkable>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '4fr',
                    }}
                  >
                    <div style={{ gridColumn: 1 }}>
                      <ReadOnlyInfoSection title={'Images'} information={''} />
                    </div>
                  </div>
                </AccordianMenu>
              </div>
              <StockHistorySection
                partId={partId}
                stockLevel={parts?.stockLevel || 0}
                onStockChanged={refetch}
              />
            </div>
          </div>
        </>
      </DataValidationStateWrapper>
    </div>
  );
}
