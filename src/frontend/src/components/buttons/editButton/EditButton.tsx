import { useTheme } from '../../../hooks/userSettings/useTheme';

interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  const themeType = useTheme();
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: themeType.textMutedColor,
        cursor: 'pointer',
        fontSize: '18px',
        marginInline: '20px',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = themeType.linkHoverColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = themeType.textMutedColor)
      }
      onClick={() => onClick()}
    >
      Edit
    </button>
  );
}
