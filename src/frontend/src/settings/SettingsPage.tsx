import { AccordianMenu } from '../components/accordianMenu/AccordianMenu';
import { StorageLocationListComponent } from './components/StorageLocationListComponent';
import { useTheme } from '../hooks/userSettings/useTheme';

export function SettingsPage() {
  const themeType = useTheme();
  return (
    <div
      style={{
        color: themeType.textPrimaryColor,
        minHeight: '100dvh',
        paddingTop: '20px',
        paddingLeft: '25px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        marginBottom: '70px',
      }}
    >
      <h1>Settings</h1>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
      >
        <div style={{ gridColumn: 'span 2' }}>
          <AccordianMenu title={'General Settings'}>
            <input type="checkbox" onChange={() => {}} />
          </AccordianMenu>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <AccordianMenu title={'Notification Settings'}>data</AccordianMenu>
        </div>
        <StorageLocationListComponent />
        <AccordianMenu title={'Categories'}>data</AccordianMenu>
      </div>
    </div>
  );
}
