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

// Big heading that starts each of the two page sections
const sectionHeadingStyle = {
  fontSize: '22px',
  fontWeight: 600,
  color: '#ffffff',
  margin: 0,
  paddingBottom: '10px',
  borderBottom: '1px solid #333333',
} as const;

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

            {/**================ Part Details section ================**/}
            <section>
              <h1 style={sectionHeadingStyle}>Part Details</h1>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                }}
              >
                <h1
                  style={{
                    color: '#a7a7a7',
                    fontSize: '16px',
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {parts?.name}
                </h1>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr .7fr',
                  gap: '20px',
                }}
              >
                <div>
                  <AccordianMenu title="Part Information" shrinkable>
                    {/**------------ Text fields (full width) ------------ **/}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr)',
                        rowGap: '20px',
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
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        columnGap: '20px',
                        rowGap: '20px',
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid #333333',
                      }}
                    >
                      <ReadOnlyInfoSection
                        title={'Current Stock Level'}
                        information={parts?.stockLevel}
                      />
                      <ReadOnlyInfoSection
                        title={'Minimum Stock Level'}
                        information={parts?.minStockLevel}
                      />
                      <ReadOnlyInfoSection
                        title={'Average Price'}
                        information={`$${parts?.averagePrice} (1)`}
                      />
                      <ReadOnlyInfoSection
                        title={'Storage Location'}
                        information={parts?.storageLocationName}
                      />
                    </div>
                  </AccordianMenu>

                  <PartImageSection
                    partId={partId}
                    partName={parts?.name ?? ''}
                    filename={parts?.filename}
                    onChanged={refetch}
                  />
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
              <h1 style={sectionHeadingStyle}>Distributor Details</h1>
              <ManufacturerAccordian
                manufacturerName={parts?.manufacturerName}
                manufacturerPartNumber={parts?.manufacturerPartNumber}
              />
              {parts?.manufacturerPartNumber && (
                <DistributorAccordian
                  partId={parts.id}
                  partNumber={parts?.manufacturerPartNumber}
                  distributorName={parts?.manufacturerName}
                />
              )}
            </section>
          </div>
        </>
      </DataValidationStateWrapper>
    </div>
  );
}
