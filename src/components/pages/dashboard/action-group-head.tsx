import { ReactNode } from "react";

export const ActionGroupHead = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);
