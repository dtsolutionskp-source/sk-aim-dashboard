import type { ReportDataTable } from '../data/marketingReportTables';

function alignClass(align?: 'left' | 'center' | 'right') {
  if (align === 'left') return 'text-left';
  if (align === 'right') return 'text-right tabular-nums';
  return 'text-center tabular-nums';
}

export default function MarketingDataTable({ table }: { table: ReportDataTable }) {
  return (
    <div className="-mx-1 mobile-scroll-x overflow-x-auto px-1 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[520px] border-collapse text-xs sm:min-w-0 sm:text-sm">
        <thead>
          <tr className="border-b border-sk-gray-200 bg-sk-gray-50">
            {table.columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-2 py-2.5 font-semibold text-sk-gray-600 sm:px-3 ${alignClass(col.align)}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-sk-gray-100 last:border-0">
              {table.columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-2 py-2.5 text-sk-gray-700 sm:px-3 ${alignClass(col.align)}`}
                >
                  {row[col.key] ?? ''}
                </td>
              ))}
            </tr>
          ))}
          {table.totalRow && (
            <tr className="border-t-2 border-sk-orange/40 bg-sk-orange-light/40">
              {table.columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-2 py-2.5 font-bold text-sk-gray-800 sm:px-3 ${alignClass(col.align)}`}
                >
                  {table.totalRow![col.key] ?? ''}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
