export function TableDataLoading() {
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
          color: '#a7a7a7',
        }}
      >
        <div>Loading...</div>
      </td>
    </tr>
  );
}
