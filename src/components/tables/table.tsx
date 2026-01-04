import { ReactNode } from "react";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
import { TUser } from "@/types/api/auth";

export const Table = ({
  columns,
  data,
  rowRenderer,
}: {
  columns: string[];
  data: TUser[];
  rowRenderer: (arg: any) => ReactNode;
}) => (
  <div className="min-h-screen overflow-x-auto font-sans">
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
        <TableHeader columns={columns} />
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {data?.map((row, index) => (
            <TableRow key={index}>{rowRenderer(row)}</TableRow>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


