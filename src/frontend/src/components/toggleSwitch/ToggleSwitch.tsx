import { useState } from 'react';
import { useTheme } from '../../hooks/userSettings/useSettings';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 22;
const KNOB_SIZE = 16;
const KNOB_GAP = (TRACK_HEIGHT - KNOB_SIZE) / 2;

// A sliding on/off switch. It is still a real checkbox underneath, so it works
// with the keyboard (Tab to focus, Space to toggle) and with screen readers.
//
//   <ToggleSwitch label="Dark mode" checked={isOn} onChange={setIsOn} />
export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleSwitchProps) {
  const themeType = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
      }}
    >
      <span
        style={{
          position: 'relative',
          width: `${TRACK_WIDTH}px`,
          height: `${TRACK_HEIGHT}px`,
          flexShrink: 0,
        }}
      >
        {/* The real checkbox, stretched over the track and made invisible */}
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            opacity: 0,
            cursor: 'inherit',
          }}
        />
        {/* The track */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: `${TRACK_HEIGHT}px`,
            backgroundColor: checked
              ? themeType.accentColor
              : themeType.borderStrongColor,
            outline: focused ? `2px solid ${themeType.textMutedColor}` : 'none',
            outlineOffset: '2px',
            transition: 'background-color 0.2s ease',
          }}
        />
        {/* The knob that slides */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `${KNOB_GAP}px`,
            left: `${KNOB_GAP}px`,
            width: `${KNOB_SIZE}px`,
            height: `${KNOB_SIZE}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: `0 1px 3px ${themeType.shadowColor}`,
            transform: checked
              ? `translateX(${TRACK_WIDTH - KNOB_SIZE - KNOB_GAP * 2}px)`
              : 'translateX(0)',
            transition: 'transform 0.2s ease',
            pointerEvents: 'none',
          }}
        />
      </span>
      {label}
    </label>
  );
}
