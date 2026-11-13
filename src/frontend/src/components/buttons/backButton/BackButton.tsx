import { useNavigate } from 'react-router';
import { useTheme } from '../../../hooks/userSettings/useTheme';

export function BackButton() {
  const nav = useNavigate();
  const themeType = useTheme();

  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: themeType.textMutedColor,
        cursor: 'pointer',
        fontSize: '17px',
      }}
      onClick={() => nav(-1)}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = themeType.linkHoverColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = themeType.textMutedColor)
      }
    >
      ← Back
    </button>
  );
}
