interface ITableHeader {
  columns: string[];
}
export const TableHeader = ({ columns }: ITableHeader) => (
  <thead className="bg-gray-100 dark:bg-gray-700 text-xs tracking-wider text-gray-600 dark:text-gray-300 uppercase">
    <tr>
      {columns.map((col, index) => (
        <th key={index} className="px-6 py-4 text-left">
          {col}
        </th>
      ))}
    </tr>
  </thead>
);
