import { useFetchDigikey } from '../../../hooks/parts/useFetchDigikey';
import { AccordianMenu } from '../../../components/accordianMenu/AccordianMenu';
import { ReadOnlyInfoSection } from '../../../components/readOnly/ReadOnlyInfoSection';

interface ManufacturerAccordianProps {
  manufacturerName?: string | null;
  manufacturerPartNumber?: string | null;
}

export function ManufacturerAccordian({
  manufacturerName,
  manufacturerPartNumber,
}: ManufacturerAccordianProps) {
  return (
    <AccordianMenu title="Manufacturer Information" shrinkable>
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
            information={manufacturerName}
          />
          <ReadOnlyInfoSection
            title="Manufacturer Part Number"
            information={manufacturerPartNumber}
          />
        </div>
      </div>
    </AccordianMenu>
  );
}
