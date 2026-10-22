import { Table } from '../../components/table/Table';
import { useFetchLowStockPartsTableData } from '../../lowStockParts/hooks/useFetchLowStockPartTableData';
import { LowStockTableCard } from '../../lowStockParts/table/LowStockTableCard';
import { TableDataLoading } from '../../components/table/TableDataLoading';
import { TableDataError } from '../../components/table/TableDataError';

export function OrderedPartsPage() {
  //fetch the lowStockPartData using the react hook
  const { lowStockTableData, loading, error } =
    useFetchLowStockPartsTableData(1);

  //Use array of string to set the amount and names of columns in table
  const headerLabels: string[] = [
    'Part Name',
    'Description',
    'Comments',
    'Stock Level',
    'Min Stock Level',
    'Distributor',
    '', //This is for the kebab menu on each card
  ];

  return (
    <div style={{ width: '97%', paddingTop: '40px' }}>
      <h2 style={{ marginBottom: '-12px', marginLeft: '50px' }}>Ordered</h2>
      <div
        style={{
          color: '#580909ff',
          marginLeft: '50px',
          marginBottom: '20px',
          fontWeight: 700,
        }}
      >
        ___
      </div>
      <div style={{ marginLeft: '30px' }}>
        <Table labels={headerLabels} tableType={'part'}>
          {loading && <TableDataLoading />}

          {error && <TableDataError />}

          {!loading &&
            !error &&
            lowStockTableData.map((part) => (
              <LowStockTableCard key={part.partId} lowStockPartData={part} />
            ))}
        </Table>
      </div>
    </div>
  );
}
