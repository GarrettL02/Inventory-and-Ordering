import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../hooks/userSettings/useTheme';

export function CreatePartButton() {
  const nav = useNavigate();
  const { themeType } = useContext(ThemeContext)!;

  return (
    <button
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
        (e.currentTarget.style.backgroundColor = themeType.buttonBackgroundColor)
      }
      onClick={() => nav('/parts/partRequest')}
    >
      Add Part Request
    </button>
  );
}
