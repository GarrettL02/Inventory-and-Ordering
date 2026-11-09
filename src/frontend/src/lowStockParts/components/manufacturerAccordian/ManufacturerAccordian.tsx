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
          information={manufacturerName}
        />
        <ReadOnlyInfoSection
          title="Manufacturer Part Number"
          information={manufacturerPartNumber}
        />
      </div>
    </AccordianMenu>
  );
}
