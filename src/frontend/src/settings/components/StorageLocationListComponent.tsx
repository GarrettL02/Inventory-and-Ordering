import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { useFetchAllStorageLocations } from '../../hooks/storageLocation/useFetchAllStorageLocations';

export function StorageLocationListComponent() {
  const { storageLocationData, loading, error } = useFetchAllStorageLocations();
  return (
    <AccordianMenu title={'Storage Locations'}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {storageLocationData.map((location) => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      )}
    </AccordianMenu>
  );
}
