import { useState } from "react";
import { Mail, ShieldAlert, UserCheck, ArrowLeft, Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { BlockNewUserForm } from "../components/forms/block-new-user-form";
import { TBlockUserResult } from "@/types/api/user";
import { useDeleteBlockedEmailMutation, useGetBlockedUsersQuery } from "@/redux/api/admin/blocked-emails";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { ModalContentConfig } from "@/types/pages/dashboard";
import { ModalDialog } from "@/components/dialog/modal-dialog";

type TModalName = "sellCoinToMerchant";
const modalContentConfig: Record<TModalName, ModalContentConfig> = {
  sellCoinToMerchant: {
    title: "Block a user",
    description: "Block user by user ID.",
    content: <BlockNewUserForm />,
  },
};
/**
 * Reusable User Row Component
 * Handles the display of individual banned user data
 */
const UserRow = ({
  user,
  onUnban,
  deleteBlockedEmailLoading,
}: {
  user: TBlockUserResult;
  onUnban: (id: string) => Promise<void>;
  deleteBlockedEmailLoading: boolean;
}) => {
  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
      {/*<td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              // onError={(e) => {
              //   e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=random`;
              // }}
            />
            <div className="absolute -bottom-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
              Gender: {user?.gender}
            </div>
          </div>
        </div>
      </td>*/}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-400 dark:text-slate-500" />
          {user?.email}
        </div>
      </td>
      {/*<td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 rounded-full">
          {user?.activityZone?.zone}
        </span>
      </td>*/}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onUnban(user._id)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-100 dark:border-emerald-800 rounded-lg transition-all duration-200 shadow-sm"
          disabled={deleteBlockedEmailLoading}
        >
          <UserCheck size={16} />
          {deleteBlockedEmailLoading ? "Please wait.." : "Unban User"}
        </button>
      </td>
    </tr>
  );
};

export const BannedUsers = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<TModalName | null>(null);

  // Open/close modal handlers
  const closeModal = () => setActiveModal(null);
  const openModal = (modalName: TModalName) => setActiveModal(modalName);

  // Get modal content for the current modal
  const modalConfig = activeModal ? modalContentConfig[activeModal] : null;

  const { data: bannedUsersData, isLoading: bannedUsersLoading } =
    useGetBlockedUsersQuery(undefined);
  // const [updateActivityZone, { isLoading: updateActivityLoading }] =
  //   useUpdateActivityZoneMutation();
    const [deleteBlockedEmail, {isLoading: deleteBlockedEmailLoading}] = useDeleteBlockedEmailMutation();
  const bannedUsers = bannedUsersData?.result || []
     

  // const filteredUsers = useMemo(() => {
  //   return bannedUsers
  //     ? bannedUsers.filter(
  //         (user) =>
  //           user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  //       )
  //     : [];
  // }, [searchTerm, bannedUsers]);

  if (bannedUsersLoading) {
    return <div>Loading...</div>;
  }

  const handleUnban = async (id: string) => {
    // const payload = {
    //   id: id,
    //   zone: "safe",
    //   date_till: "",
    // };

    try {
      // const res = await updateActivityZone(payload).unwrap();
      const res = await deleteBlockedEmail({_id: id}).unwrap();
      // 🔥 TOAST MESSAGES BASED ON ZONE TYPE
      toast.success(res.message || "successfully unbanned!");
    } catch (err: any) {
      console.error("API error:", err);
      toast.error(
        err.data.message || err.message || "Somthing wrong to unbaning user",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent font-sans text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
              Banned Live Lists
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-bold rounded-md">
                {bannedUsersData?.result?.length
                  ? bannedUsersData?.result?.length
                  : 0}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage users who have been restricted from live streaming
              privileges.
            </p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <ActionTinyButton
              variant={"danger"}
              onClick={() => openModal("sellCoinToMerchant"!)}
            >
              <Ban size={16} className="mr-2" />
              Block User
            </ActionTinyButton>
            {/*Search users input filed*/}
            {/*<div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-11 pr-4 py-3 w-full md:w-80 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>*/}
          </div>
        </div>
          {/* Content Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-gray-700 border-b border-slate-200 dark:border-slate-600">
                    {/*<th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    User Info
                  </th>*/}
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Email
                    </th>
                    {/*<th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Status
                  </th>*/}
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-600">
                  {bannedUsers.length > 0 ? (
                    bannedUsers!.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onUnban={handleUnban}
                        deleteBlockedEmailLoading={deleteBlockedEmailLoading}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <ShieldAlert
                              size={32}
                              className="text-slate-300 dark:text-slate-600"
                            />
                          </div>
                          <div>
                            <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                              No Banned Users Found
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm">
                              Everything looks clean. No streamers are currently
                              restricted.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            <div className="bg-slate-50 dark:bg-gray-700 px-6 py-4 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                <span>
                  Showing {bannedUsers?.length || 0} restricted accounts
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Live Enforcement Active
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Modal for actions */}
        <ModalDialog
          isOpen={!!activeModal}
          onClose={closeModal}
          title={modalConfig?.title || ""}
          description={modalConfig?.description}
        >
          {modalConfig?.content}
        </ModalDialog>

    </div>
  );
};
