import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { useSettings } from '../../data/hooks/userSettings/useSettings';
import { useUpdateUserSettings } from '../../data/hooks/userSettings/useUpdateUserSettings';
import { ToggleSwitch } from '../../components/toggleSwitch/ToggleSwitch';
import { UserSettingsData } from '../../data/types/userSettings/userSettings';

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
        onChange={(isOn) =>
          handleSettingChange('theme', isOn ? 'dark' : 'light')
        }
      />

      {error && <p role="alert">{error}</p>}
    </AccordianMenu>
  );
}
