import { useGetAgencyWithdrawRequestsQuery } from "@/redux/api/auth.api";
import { TWidrawRequest } from "@/types/api/auth";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const AgencyWithdrawHistoryPage = ({
  onBack = "/",
}: {
  onBack: string;
}) => {
  const { data: withdrawRequestRes, isLoading } =
    useGetAgencyWithdrawRequestsQuery({});
  const agencyWithdrawHistory = withdrawRequestRes?.result?.data || [];
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8">
        <Link
          to={onBack}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
        >
          <ArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Agency Withdraw History
        </h1>
      </header>
      <div className="space-y-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <HistoryTable title="Agency Withdraws" data={agencyWithdrawHistory} />
        )}
        {/* <HistoryTable title="Host Withdraws" data={hostWithdrawHistory} /> */}
      </div>
    </div>
  );
};

// Withdraw History Page Components
type StatusType = "Completed" | "Pending" | "Failed";

const StatusBadge = ({ status }: { status: StatusType }) => {
  const styles: Record<StatusType, string> = {
    Completed: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    Failed: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const HistoryTable = ({
  title,
  data,
}: {
  title: string;
  data: TWidrawRequest[];
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Transaction ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Withdraw Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          {data.map((item) => (
            <tr key={item._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {item._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                ${item.totalSalary.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.withdrawDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <StatusBadge status={item?.status as StatusType} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
