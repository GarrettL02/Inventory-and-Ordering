import { useEffect, useState } from 'react';
import { LowStockTableCard } from '../table/LowStockTableCard';
import { Table } from '../../components/table/Table';
import { TableNoData } from '../../components/table/TableNoData';
import { useFetchLowStockPartsTableData } from '../hooks/useFetchLowStockPartTableData';
import { useSearchParams } from 'react-router-dom';
import { TableDataError } from '../../components/table/TableDataError';
import { TableDataLoading } from '../../components/table/TableDataLoading';
//import { LowStockTableFilters } from '../tableFilters/LowStockTableFilters';
import { CreatePartButton } from '../createPartButton/CreatePartButton';
import { CartBar } from '../components/CartBar';

export function LowStockPage() {
  const [isCartExpanded, setIsCartExpanded] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // Get page from URL, default to 1
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  //fetch the lowStockPartData using the react hook
  const { lowStockTableData, loading, error, page, setPage, pagination } =
    useFetchLowStockPartsTableData(pageFromUrl);

  // Sync URL when page changes
  useEffect(() => {
    setSearchParams({ page: page.toString(), limit: '15' });
  }, [page, setSearchParams]);

  // Sync page state with URL on mount
  useEffect(() => {
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, []);

  // Show pagination only if data loaded, no error, and more than 1 page exists
  const showPagination =
    !loading && !error && pagination && pagination.totalPages > 1;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  //Use array of string to set the amount and names of columns in table
  const headerLabels: string[] = [
    'Part Name',
    'Description',
    'Comments',
    'Stock Level',
    'Price',
    '', //This is for the kebab menu on each card
  ];

  return (
    <div
      style={{
        width: isCartExpanded ? '68%' : '90%',
        maxWidth: '90%',
        transition: 'width 0.3s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        paddingBottom: '1rem',
        paddingTop: '40px', //Needed on all pages to offset header
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '-12px', marginLeft: '50px' }}>
            Need Ordered
          </h2>
          <div
            style={{ color: '#580909ff', marginLeft: '50px', fontWeight: 700 }}
          >
            ___
          </div>
        </div>
        <CreatePartButton />
      </div>
      <div
        style={{ marginLeft: '30px', marginBottom: '20px', maxWidth: '100%' }}
      >
        {/* <LowStockTableFilters /> */}
        <Table labels={headerLabels} tableType={'part'}>
          {loading && <TableDataLoading />}

          {error && <TableDataError />}

          {!loading && !error && lowStockTableData.length === 0 && (
            <TableNoData />
          )}

          {!loading &&
            !error &&
            lowStockTableData.length > 0 &&
            lowStockTableData.map((part) => (
              <LowStockTableCard
                key={part.lowStockId}
                lowStockPartData={part}
              />
            ))}
        </Table>
        {showPagination && (
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
              style={{
                border: 'none',
                borderRadius: '10px',
                padding: '7px 10px',
                cursor: 'pointer',
              }}
            >
              ← Previous
            </button>
            <span style={{ margin: '0 20px' }}>
              Page {pagination?.page} of {pagination?.totalPages} (
              {pagination?.total} total items)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination?.totalPages || loading}
              style={{
                border: 'none',
                borderRadius: '10px',
                padding: '7px 10px',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      <CartBar
        isExpanded={isCartExpanded}
        onToggle={() => setIsCartExpanded(!isCartExpanded)}
      />
    </div>
  );
}
