import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { useSettings } from '../../hooks/userSettings/useSettings';
import { useUpdateUserSettings } from '../../hooks/userSettings/useUpdateUserSettings';
import { UserSettingsData } from '../../types/userSettings/userSettings';
import { ToggleSwitch } from '../../components/toggleSwitch/ToggleSwitch';

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

  return (
    <AccordianMenu title={'General Settings'}>
      <ToggleSwitch
        label="Dark mode"
        checked={settings.theme === 'dark'}
        disabled={loading}
        onChange={(isOn) => handleSettingChange('theme', isOn ? 'dark' : 'light')}
      />

      {error && <p role="alert">{error}</p>}
    </AccordianMenu>
  );
}
