interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  emptyMessage?: string;
}

export function AdminTable<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  emptyMessage = "No items found.",
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 align-middle ${col.className ?? ""}`}>
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
