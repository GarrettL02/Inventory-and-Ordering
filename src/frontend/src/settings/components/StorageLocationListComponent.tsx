import { useMemo, useState } from 'react';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { useToast } from '../../components/toast/ToastProvider';
import { useAddStorageLocation } from '../../hooks/storageLocation/useAddStorageLocation';
import { useFetchAllStorageLocations } from '../../hooks/storageLocation/useFetchAllStorageLocations';
import { StorageLocationData } from '../../types/storageLocation/storageLocation';
import { TrashRemoveIcon } from '../../components/icons/TrashRemoveIcon';
import { ConfirmDeleteStorageLocationModal } from './ConfirmDeleteStorageLocationModal';
import { useTheme } from '../../hooks/userSettings/useTheme';

export function StorageLocationListComponent() {
  const themeType = useTheme();
  const { storageLocationData, loading, error, refetch } =
    useFetchAllStorageLocations();
  const {
    addStorageLocation,
    loading: saving,
    error: addError,
    clearError,
  } = useAddStorageLocation();
  const { showToast } = useToast();

  // What the user is typing in the "add" box
  const [newName, setNewName] = useState('');

  // The location whose delete confirmation is open (null = no modal)
  const [locationToDelete, setLocationToDelete] =
    useState<StorageLocationData | null>(null);

  // A-Z, with numbers sorted as numbers so "Bin 2" comes before "Bin 10"
  const sortedLocations = useMemo(
    () =>
      [...storageLocationData].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      ),
    [storageLocationData],
  );

  const count = sortedLocations.length;
  const countLabel = `${count} ${count === 1 ? 'location' : 'locations'}`;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the browser from reloading the page
    const name = newName.trim();
    if (!name) return;

    const created = await addStorageLocation(name);
    // null means it failed - keep what the user typed, the hook has the error
    if (!created) return;

    setNewName('');
    showToast(`Added storage location "${created.name}"`);
    refetch(); // reload the list so the new location shows up
  };

  // Called by the modal after the delete went through
  const handleDeleted = (name: string) => {
    showToast(`Deleted storage location "${name}"`);
    refetch(); // reload the list so the location disappears
  };

  return (
    <AccordianMenu
      title="Storage Locations"
      shrinkable
      closedExtraText={!loading && !error ? countLabel : undefined}
    >
      <style>{`
        .storage-location-row { transition: background-color 0.15s ease; }
        .storage-location-row:hover { background-color: ${themeType.hoverOverlayColor}; }
        .storage-location-delete { color: ${themeType.textMutedColor}; transition: color 0.15s ease; }
        .storage-location-delete:hover { color: ${themeType.errorTextColor}; }
      `}</style>

      {locationToDelete && (
        <ConfirmDeleteStorageLocationModal
          storageLocationId={locationToDelete.id}
          storageLocationName={locationToDelete.name}
          onClose={() => setLocationToDelete(null)}
          onDeleted={() => handleDeleted(locationToDelete.name)}
        />
      )}

      {/* ---------- Add a location ---------- */}
      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '0 0 12px',
        }}
      >
        <input
          aria-label="New storage location name"
          placeholder="New location name..."
          value={newName}
          maxLength={255}
          disabled={saving}
          onChange={(e) => {
            setNewName(e.target.value);
            if (addError) clearError();
          }}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px 10px',
            fontSize: '14px',
            backgroundColor: themeType.inputBackgroundColor,
            color: themeType.inputTextColor,
            border: `2px solid ${addError ? themeType.inputErrorBorderColor : themeType.inputBorderColor}`,
            borderRadius: '5px',
          }}
        />
        <GeneralButton
          type="submit"
          buttonText={saving ? 'Adding...' : 'Add'}
          disabled={saving || newName.trim() === ''}
        />
      </form>
      {addError && (
        <p
          role="alert"
          style={{
            margin: '0 0 12px',
            color: themeType.errorTextColor,
            fontSize: '13px',
          }}
        >
          {addError}
        </p>
      )}

      {loading && (
        <p
          style={{
            margin: 0,
            padding: '12px 16px',
            color: themeType.textMutedColor,
            fontSize: '13px',
          }}
        >
          Loading...
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: '12px 16px',
            color: themeType.errorTextColor,
            fontSize: '13px',
          }}
        >
          Could not load storage locations: {error}
        </p>
      )}

      {!loading && !error && count === 0 && (
        <p
          style={{
            margin: 0,
            padding: '12px 16px',
            color: themeType.textMutedColor,
            fontSize: '13px',
          }}
        >
          No storage locations yet.
        </p>
      )}

      {!loading && !error && count > 0 && (
        <>
          <div
            style={{
              padding: '0 16px 8px',
              color: themeType.textMutedColor,
              fontSize: '12px',
            }}
          >
            {countLabel}
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: '280px',
              overflowY: 'auto',
              border: `1px solid ${themeType.borderStrongColor}`,
              borderRadius: '8px',
              backgroundColor: themeType.surfaceExpandedColor,
            }}
          >
            {sortedLocations.map((location, index) => (
              <li
                key={location.id}
                className="storage-location-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  borderTop:
                    index === 0
                      ? 'none'
                      : `1px solid ${themeType.borderColor}`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: themeType.accentColor,
                    flexShrink: 0,
                  }}
                />
                {location.name}
                <button
                  type="button"
                  className="storage-location-delete"
                  aria-label={`Delete storage location ${location.name}`}
                  title="Delete"
                  onClick={() => setLocationToDelete(location)}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <TrashRemoveIcon />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </AccordianMenu>
  );
}
