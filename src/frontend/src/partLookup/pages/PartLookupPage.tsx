import { useEffect, useState } from 'react';
import { Table } from '../../components/table/Table';
import { TableNoData } from '../../components/table/TableNoData';
import { useSearchParams } from 'react-router-dom';
import { TableDataError } from '../../components/table/TableDataError';
import { TableDataLoading } from '../../components/table/TableDataLoading';
import { useFetchParts } from '../hooks/useFetchParts';
import { PartTableCard } from '../table/PartTableCard';

export function PartLookupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');

  // Get page from URL, default to 1
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  //fetch the lowStockPartData using the react hook
  const {
    parts,
    loading,
    error,
    page,
    setPage,
    pagination,
    search,
    setSearch,
  } = useFetchParts(pageFromUrl);

  // Sync URL when page changes
  useEffect(() => {
    setSearchParams({ page: page.toString() });
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

  // Debounce the user input by 300ms before sending it to the custom hook
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(inputValue);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, setSearch]);

  //Use array of string to set the amount and names of columns in table
  const headerLabels: string[] = [
    'Part Name',
    'Description',
    'Comments',
    'Stock Level',
    'Storage Location',
    '', //This is for the kebab menu on each card
  ];

  return (
    <div
      style={{
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
            Inventory
          </h2>
          <div
            style={{ color: '#580909ff', marginLeft: '50px', fontWeight: 700 }}
          >
            ___
          </div>
        </div>
        <div>
          <input
            placeholder="Search for part..."
            value={inputValue}
            style={{
              padding: '7px',
              width: '250px',
              border: '1px solid white',
              borderRadius: '7px',
              backgroundColor: '#161616',
              color: 'white',
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      <div
        style={{ marginLeft: '30px', marginBottom: '20px', maxWidth: '100%' }}
      >
        {/* Filters for parts - In stock, storage location, board/manufacturer?? */}
        <Table labels={headerLabels} tableType={'part'}>
          {loading && <TableDataLoading />}

          {error && <TableDataError />}

          {!loading && !error && parts.length === 0 && <TableNoData />}

          {!loading &&
            !error &&
            parts.length > 0 &&
            parts.map((part) => (
              <PartTableCard key={part.id} partData={part} />
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
    </div>
  );
}
