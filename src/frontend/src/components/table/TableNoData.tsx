export function TableNoData() {
  return (
    <tr>
      <td
        colSpan={100}
        style={{
          borderBottom: 'none',
          backgroundColor: 'rgb(27, 27, 27)',
          minWidth: '100%',
          padding: '2.5rem 1rem',
          textAlign: 'center',
          fontSize: '18px',
          color: '#cfcfcf',
        }}
      >
        <div>There is Nothing to Display!</div>
      </td>
    </tr>
  );
}
