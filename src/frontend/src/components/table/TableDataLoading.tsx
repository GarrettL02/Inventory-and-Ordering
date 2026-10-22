export function TableDataLoading() {
  return (
    <tr>
      <td
        colSpan={100}
        style={{
          borderBottom: '1px solid #ccc',
          backgroundColor: 'rgb(27, 27, 27)',
          minWidth: '100%',
          height: '500px',
          textAlign: 'center',
          fontSize: '20px',
        }}
      >
        <div>Loading Data.....</div>
      </td>
    </tr>
  );
}
