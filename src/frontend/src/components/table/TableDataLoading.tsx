import { useContext } from 'react';
import { ThemeContext } from '../../settings/themeStyling/ThemeProvider';

export function TableDataLoading() {
  const { themeType } = useContext(ThemeContext)!;

  return (
    <tr>
      <td
        colSpan={100}
        style={{
          backgroundColor: themeType.surfaceColor,
          minWidth: '100%',
          padding: '4rem 1rem',
          textAlign: 'center',
          fontSize: '14px',
          color: themeType.textMutedColor,
        }}
      >
        <div>Loading...</div>
      </td>
    </tr>
  );
}
