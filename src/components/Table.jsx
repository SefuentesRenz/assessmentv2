export default function Table({ columns, data, onEdit, onDelete }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-sm font-semibold text-slate-700"
              >
                {column.label}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row) => (
            <tr key={row[Object.keys(row)[0]]} className="hover:bg-slate-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-right text-sm">
                <button
                  onClick={() => onEdit(row)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors mr-2 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row[Object.keys(row)[0]])}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
