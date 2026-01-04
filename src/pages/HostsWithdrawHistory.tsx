import { useGetHostsWithdrawRequestsQuery } from "@/redux/api/auth.api";
import { TWidrawRequest } from "@/types/api/auth";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const HostsWithdrawHistoryPage = ({
  onBack = "/",
}: {
  onBack: string;
}) => {
  const { data: withdrawRequestRes, isLoading } =
    useGetHostsWithdrawRequestsQuery({});
  const hostsWithdrawHistory = withdrawRequestRes?.result?.data || [];

  // PDF generation using jspdf + jspdf-autotable dynamically imported

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Header
      doc.setFontSize(14);
      doc.text("Hosts Withdraw Requests", 40, 40);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 56);

      const columns = [
        "Transaction ID",
        "Host Name",
        "Account",
        "Method",
        "Day",
        "Time (mins)",
        "Audio Hr",
        "Video Hr",
        "Diamonds",
        "Salary",
        "Date",
        "Agency",
        "Status",
      ];

      const rows = hostsWithdrawHistory.map((item) => [
        item._id,
        item.name,
        item.accountNumber,
        item.accountType,
        item.day ?? "-",
        item.time ?? "-",
        item.audioHour ?? "-",
        item.videoHour ?? "-",
        item.totalDiamond != null ? item.totalDiamond.toLocaleString() : "-",
        item.totalSalary != null ? `$${item.totalSalary}` : "-",
        item.withdrawDate ? new Date(item.withdrawDate).toLocaleString() : "-",
        item?.agencyId?.name ?? "-",
        item.status ?? "-",
      ]);

      // Correct invocation: autoTable(doc, options)
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 70,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [230, 230, 230], textColor: 20 },
        theme: "striped",
        didDrawPage: (dataArg) => {
          // footer with page number
          const pageCount = (doc as any).internal.pages.length - 1; // jspdf page count fallback
          const page =
            dataArg.pageNumber || (dataArg as any).pageIndex + 1 || 1;
          doc.setFontSize(8);
          const x = doc.internal.pageSize.getWidth() - 80;
          const y = doc.internal.pageSize.getHeight() - 30;
          doc.text(`Page ${page} / ${pageCount}`, x, y); //(`Page ${page} / ${pageCount}`, x, y);
        },
      });

      doc.save(`withdraw-requests-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert(
        "Failed to generate PDF. Make sure jspdf and jspdf-autotable are installed.",
      );
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        {/*left side*/}
        <div>
          <Link
            to={onBack}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
          >
            <ArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Hosts Withdraw History
          </h1>
        </div>
        {/*Right side*/}
        <div>
          <ActionTinyButton onClick={handleDownloadPDF}>
            <Download size={20} className="me-2" />
            Download
          </ActionTinyButton>
        </div>
      </header>
      <div className="space-y-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <HistoryTable
            title=""
            data={hostsWithdrawHistory}
            isLoading={isLoading}
          />
        )}
        {/* <HistoryTable title="Host Withdraws" data={hostWithdrawHistory} /> */}
      </div>
    </div>
  );
};

// Withdraw History Page Components
type StatusType = "Completed" | "Pending" | "Failed" | string;

const getStatusClass = (status: StatusType) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Failed":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const HistoryTable = ({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: TWidrawRequest[];
  isLoading: boolean;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
    <Alternative data={data} loading={isLoading} />
  </div>
);

export const Alternative = ({
  loading,
  data,
}: {
  loading: boolean;
  data: any;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
            <th className="py-3">Transaction ID</th>
            <th>Host</th>
            <th>Account</th>
            <th>Method</th>
            <th>Day</th>
            <th>Time</th>
            <th>Audio Hour</th>
            <th>Video Hour</th>
            <th>Diamonds</th>
            <th>Salary</th>
            <th>Date</th>
            <th>Agency</th>
            <th>Status</th>
            {/*<th>Action</th>*/}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={13} className="text-center py-6 text-gray-500 dark:text-gray-400">
                Loading...
              </td>
            </tr>
          ) : (
            data.map((item: any) => (
              <tr key={item._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 text-xs text-gray-600 dark:text-gray-400">
                  {item._id ?? "-"}
                </td>
                <td className="flex items-center gap-2 py-3">
                  <img
                    src={item?.hostId?.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="truncate text-gray-900 dark:text-gray-100">{item.hostId?.name ?? "-"}</div>
                </td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item.accountNumber ?? "-"}</td>
                <td className="capitalize py-3">
                  <Badge variant="outline">{item.accountType ?? "-"}</Badge>
                </td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item.day ?? "-"}</td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item.time ?? "-"}</td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item.audioHour ?? "-"}</td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item.videoHour ?? "-"}</td>
                <td className="py-3 text-gray-900 dark:text-gray-100">
                  {item.totalDiamond != null
                    ? item.totalDiamond.toLocaleString()
                    : "-"}
                </td>
                <td className="py-3 text-gray-900 dark:text-gray-100">
                  {item.totalSalary != null
                    ? `$${item.totalSalary.toFixed(2)}`
                    : "-"}
                </td>
                <td className="py-3 text-gray-900 dark:text-gray-100">
                  {item.withdrawDate
                    ? new Date(item.withdrawDate).toLocaleString()
                    : "-"}
                </td>
                <td className="py-3 text-gray-900 dark:text-gray-100">{item?.agencyId?.name ?? "-"}</td>
                <td className="py-3">
                  <Badge className={getStatusClass(item.status)}>
                    {item.status ?? "-"}
                  </Badge>
                </td>
                {/*<td className="py-3">
                  <button className="text-indigo-600 hover:underline text-sm">View</button>
                </td>*/}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
