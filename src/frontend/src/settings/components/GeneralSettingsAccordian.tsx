import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { useSettings } from '../../data/hooks/userSettings/useSettings';
import { useUpdateUserSettings } from '../../data/hooks/userSettings/useUpdateUserSettings';
import { ToggleSwitch } from '../../components/toggleSwitch/ToggleSwitch';
import { UserSettingsData } from '../../data/types/userSettings/userSettings';

interface UserSettingsProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (isOn: boolean) => void;
}

export function GeneralSettingsAccordian() {
  const { settings } = useSettings();
  const { updateUserSettings, loading, error, clearError } =
    useUpdateUserSettings();

  // One handler for every setting: pass the setting's name and its new value
  function handleSettingChange<K extends keyof UserSettingsData>(
    key: K,
    value: UserSettingsData[K],
  ) {
    clearError();
    updateUserSettings({ [key]: value } as Partial<UserSettingsData>);
  }

  // List of user setting that will get formatted below. Add new user settings buttons here
  const userSettings: UserSettingsProps[] = [
    {
      label: 'Dark Mode',
      checked: settings.theme === 'dark',
      disabled: loading,
      onChange: (isOn: boolean) =>
        handleSettingChange('theme', isOn ? 'dark' : 'light'),
    },
    {
      label:
        'Distributor Lookups: Allows API calls to distributor platforms to get data about parts',
      checked: settings.distributorLookups,
      disabled: loading,
      onChange: (isOn: boolean) =>
        handleSettingChange('distributorLookups', isOn),
    },
  ];

  return (
    <AccordianMenu title={'General Settings'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {userSettings.map((setting) => (
          <ToggleSwitch
            label={setting.label}
            checked={setting.checked}
            disabled={setting.disabled}
            onChange={(isOn) => setting.onChange(isOn)}
          />
        ))}
      </div>

      {error && <p role="alert">{error}</p>}
    </AccordianMenu>
  );
}
