import { useFetchPartDistributorById } from '../../../data/hooks/partDistributors/useFetchPartDistributorsById';
import { useTheme } from '../../../data/hooks/userSettings/useSettings';
import { DistributorAccordian } from './DistributorAccordian';

// Big heading that starts each of the two page sections
const sectionHeadingStyle = {
  fontSize: '22px',
  fontWeight: 600,
  margin: 0,
  paddingBottom: '10px',
} as const;

export interface DistributorDetailsSectionProps {
  partId: number;
}

export function DistributorDetailsSection({
  partId,
}: DistributorDetailsSectionProps) {
  const themeType = useTheme();
  const { partDistributorData, loading, error } =
    useFetchPartDistributorById(partId);

  return (
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
        {partDistributorData.map((distributor) => (
          <DistributorAccordian
            key={distributor.id}
            partId={distributor.partId}
            name={distributor.distributor}
            partNumber={distributor.distributorPartNumber}
            productUrl={distributor.productURL}
          />
        ))}
      </div>
    </section>
  );
}
