import { useContext } from 'react';
import { ThemeContext } from '../../settings/themeStyling/ThemeProvider';

export function TableDataError() {
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
          color: themeType.errorTextColor,
        }}
      >
        <div>Error loading data.</div>
      </td>
    </tr>
  );
}
