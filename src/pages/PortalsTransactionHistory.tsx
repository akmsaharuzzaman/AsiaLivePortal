import { useGetPortalUserTransactionsQuery } from "@/redux/api/auth.api";
import { selectUser } from "@/redux/features/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import { TTransactionAdminHistory } from "@/types/api/auth";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// const hostWithdrawHistory = [
//   {
//     id: "HW001",
//     name: "HostGamer1",
//     amount: 150.0,
//     withdrawDate: "2025-08-28",
//     status: "Completed",
//   },
//   {
//     id: "HW002",
//     name: "LiveStreamerPro",
//     amount: 275.25,
//     withdrawDate: "2025-08-28",
//     status: "Completed",
//   },
//   {
//     id: "HW003",
//     name: "QueenOfGames",
//     amount: 500.0,
//     withdrawDate: "2025-08-29",
//     status: "Pending",
//   },
//   {
//     id: "HW004",
//     name: "TheJoker",
//     amount: 95.5,
//     withdrawDate: "2025-08-29",
//     status: "Completed",
//   },
// ];

export const PortalsTransactionHistoryPage = ({
  onBack = "/",
}: {
  onBack: string;
}) => {
  const user = useAppSelector(selectUser);
  const { data: resellerTransactionHistory, isLoading } =
    useGetPortalUserTransactionsQuery({ userId: user ? user.id : "undefined" }); // passing the auth stored user _id to get the portal transaction history
  if (isLoading) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;
  }
  const resellerTransactions = resellerTransactionHistory?.result?.data || [];
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
          Transaction History
        </h1>
      </header>
      <div className="space-y-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <HistoryTable
            //   title="Agency Withdraws"
            data={resellerTransactions}
          />
        )}
        {/* <HistoryTable title="Host Withdraws" data={hostWithdrawHistory} /> */}
      </div>
    </div>
  );
};

// Withdraw History Page Components
// type StatusType = "Completed" | "Pending" | "Failed";

// const StatusBadge = ({ status }: { status: StatusType }) => {
//   const styles: Record<StatusType, string> = {
//     Completed: "bg-green-100 text-green-800",
//     Pending: "bg-yellow-100 text-yellow-800",
//     Failed: "bg-red-100 text-red-800",
//   };
//   return (
//     <span
//       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}
//     >
//       {status}
//     </span>
//   );
// };

const HistoryTable = ({
  //   title,
  data,
}: {
  //   title: string;
  data: TTransactionAdminHistory[];
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2> */}
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
              Reciever Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Date
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
                {item?.receiver?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                ${item.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.receiverRole} - {item.createdAt.split("T")[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(item.createdAt).toLocaleTimeString()} -{" "}
                {item.createdAt.split("T")[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
