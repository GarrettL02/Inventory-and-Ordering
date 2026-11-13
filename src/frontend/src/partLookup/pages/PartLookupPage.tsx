import { useEffect, useState } from 'react';
import { Table } from '../../components/table/Table';
import { TableNoData } from '../../components/table/TableNoData';
import { useSearchParams } from 'react-router-dom';
import { TableDataError } from '../../components/table/TableDataError';
import { TableDataLoading } from '../../components/table/TableDataLoading';
import { PartTableCard } from '../table/PartTableCard';
import { AddNewPartForm } from '../forms/AddNewPartForm';
import { useFetchAllStorageLocations } from '../../hooks/storageLocation/useFetchAllStorageLocations';
import { FormInputOption } from '../../components/form/FormInputProps';
import { useFetchParts } from '../../hooks/parts/useFetchParts';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function PartLookupPage() {
  const themeType = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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
    refetch,
  } = useFetchParts(pageFromUrl);

  // Storage locations for the Add New Part form's dropdown
  const { storageLocationData } = useFetchAllStorageLocations();

  // The dropdown wants { value, label }, the API gives { id, name }
  const storageLocationOptions: FormInputOption[] = storageLocationData.map(
    (location) => ({ value: location.id, label: location.name }),
  );

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
        color: themeType.textPrimaryColor,
      }}
    >
      {modalOpen && (
        <AddNewPartForm
          onClose={() => setModalOpen(false)}
          onCreated={refetch}
          storageLocations={storageLocationOptions}
        />
      )}
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
            style={{
              color: themeType.accentColor,
              marginLeft: '50px',
              fontWeight: 700,
            }}
          >
            ___
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              backgroundColor: themeType.buttonBackgroundColor,
              color: themeType.buttonTextColor,
              border: `1px solid ${themeType.buttonBorderColor}`,
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 550,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                themeType.buttonHoverBackgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                themeType.buttonBackgroundColor)
            }
          >
            Add New Part
          </button>
          <input
            placeholder="Search for part..."
            value={inputValue}
            style={{
              padding: '7px',
              width: '250px',
              border: `1px solid ${themeType.compactInputBorderColor}`,
              borderRadius: '7px',
              backgroundColor: themeType.compactInputBackgroundColor,
              color: themeType.compactInputTextColor,
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      <div
        style={{ marginLeft: '30px', marginBottom: '20px', maxWidth: '100%' }}
      >
        {/* Filters for parts - In stock, storage location, board/manufacturer?? */}
        <Table labels={headerLabels}>
          {loading && <TableDataLoading />}

          {error && <TableDataError />}

          {!loading && !error && parts.length === 0 && <TableNoData />}

          {!loading &&
            !error &&
            parts.length > 0 &&
            parts.map((part) => (
              <PartTableCard
                key={part.id}
                partData={part}
                onStockChanged={refetch}
                onDeleted={() => {
                  // Deleted the last row on this page -> go back a page (that triggers a fetch)
                  if (parts.length === 1 && page > 1) setPage(page - 1);
                  else refetch();
                }}
              />
            ))}
        </Table>
        {showPagination && (
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor =
                    themeType.surfaceHoverColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeType.surfaceColor;
              }}
              style={{
                backgroundColor: themeType.surfaceColor,
                color: themeType.textPrimaryColor,
                border: `1px solid ${themeType.borderColor}`,
                borderRadius: '10px',
                padding: '7px 10px',
                cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
                opacity: page === 1 || loading ? 0.55 : 1,
              }}
            >
              ← Previous
            </button>
            <span
              style={{ margin: '0 20px', color: themeType.textSecondaryColor }}
            >
              Page {pagination?.page} of {pagination?.totalPages} (
              {pagination?.total} total items)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination?.totalPages || loading}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor =
                    themeType.surfaceHoverColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeType.surfaceColor;
              }}
              style={{
                backgroundColor: themeType.surfaceColor,
                color: themeType.textPrimaryColor,
                border: `1px solid ${themeType.borderColor}`,
                borderRadius: '10px',
                padding: '7px 10px',
                cursor:
                  page === pagination?.totalPages || loading
                    ? 'not-allowed'
                    : 'pointer',
                opacity: page === pagination?.totalPages || loading ? 0.55 : 1,
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
