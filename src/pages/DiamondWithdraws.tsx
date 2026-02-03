
import {
  useAdminApproveBankWithdrawMutation,
  useUnapprovedBankWithdrawsQuery,
} from "@/redux/api/diamond-withdraw";
import { TDiamondBankWithdraw } from "@/types/api/diamond-withdrawals";
import { Flag} from "lucide-react";
import { toast } from "sonner";

export const DiamondWithdraws = () => {
  const { data: unapprovedResponse } = useUnapprovedBankWithdrawsQuery();
  const [adminApproveBankWithdraw] = useAdminApproveBankWithdrawMutation();
  // Admin Portal Lists
  const withdrawals = unapprovedResponse?.result?.data ||  [
            {
                "_id": "6977340e0e8652099c63c0ab",
                "userId": "686e47f59edb3a9f2d80e208",
                "country": "BD",
                "method": "bkash",
                "diamondAmount": 5000,
                "moneyshare": 5,
                accountNumber: "01712345678",
                accountName: "John Doe",
                "assignedMerchant": "68a8f4e59edb3a9f2d80d123",
                "adminApproval": false,
                "paidStatus": false,
                "createdAt": "2026-01-26T09:29:50.300Z",
                "updatedAt": "2026-01-26T09:29:50.300Z",
                "__v": 0
            }
        ];

  // --- Logic handlers ---
  const handleApprove = async (id: string) => {
    try {
      const res = await adminApproveBankWithdraw({
        diamondWIthdrawId: id,
      }).unwrap();
      toast.success(res.message || "Diamond withdraw approved");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Pending Bank Withdrawals
        </h2>
        <p className="text-slate-100 text-sm mt-1">
          Review requests from users before they move to merchant claiming.
        </p>
      </div>
      <DataTable
        data={withdrawals}
        emptyMessage="Hooray! No pending requests to review."
        actions={(item: TDiamondBankWithdraw) => (
          <button
            onClick={() => handleApprove(item._id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-100"
          >
            Approve Request
          </button>
        )}
      />
    </div>
  );
};

const StatusBadge = ({ item }: { item: TDiamondBankWithdraw }) => {
  if (item.paidStatus)
    return (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
        PAID
      </span>
    );
  if (item.adminApproval)
    return (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
        APPROVED
      </span>
    );
  return (
    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
      UNPAID
    </span>
  );
};

const DataTable = ({ data, actions, emptyMessage }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider">
              User ID / Date
            </th>
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider">
              Account Name & Number
            </th>
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider text-right">
              Country
            </th>
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider text-right">
              Assigned Merchant
            </th>
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider text-center">
              Status
            </th>
            <th className="p-4 font-semibold text-slate-600 text-xs tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-slate-400 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item: TDiamondBankWithdraw) => (
              <tr
                key={item._id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="p-4">
                  <div className="text-xs font-mono text-slate-400">
                    #{item.userId.slice(-10)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    {item?.accountName || "N/A"}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase font-bold">
                      {item.accountNumber || "N/A"}
                    </span>
                    {/* <span className="text-[10px] flex items-center gap-0.5 text-slate-400">
                      <Account size={10} /> {item.country}
                    </span> */}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-gray-600 font-bold">
                    <Flag size={14} fill="#000"/>
                    {item.country}
                  </div>
                </td>
               <td className="p-4 text-right">
                  <div className="text-xs font-mono text-slate-400">
                    #{item?.assignedMerchant!.slice(-10)}
                  </div>
                  
                </td>
                <td className="p-4 text-center">
                  <StatusBadge item={item} />
                </td>
                <td className="p-4 text-right">{actions(item)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
