export function TableDataError() {
  return (
    <tr>
      <td
        colSpan={100}
        style={{
          backgroundColor: '#242424',
          minWidth: '100%',
          padding: '4rem 1rem',
          textAlign: 'center',
          fontSize: '14px',
          color: '#ef5350',
        }}
      >
        <div>Error loading data.</div>
      </td>
    </tr>
  );
}
