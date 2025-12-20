import {
  useGetBannedUsersQuery,
  useUpdateActivityZoneMutation,
} from "@/redux/api/admin/user-activities";

import React, { useState, useMemo } from "react";
import { Search, Mail, ShieldAlert, UserCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TUser } from "@/types/api/auth";

/**
 * Reusable User Row Component
 * Handles the display of individual banned user data
 */
const UserRow = ({
  user,
  onUnban,
  updateActivityLoading,
}: {
  user: TUser;
  onUnban: (id: string) => Promise<void>;
  updateActivityLoading: boolean;
}) => {
  return (
    <tr className="group hover:bg-slate-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              // onError={(e) => {
              //   e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=random`;
              // }}
            />
            <div className="absolute -bottom-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{user?.name}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Gender: {user?.gender}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-400" />
          {user?.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
          {user?.activityZone?.zone}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onUnban(user._id)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 rounded-lg transition-all duration-200 shadow-sm"
          disabled={updateActivityLoading}
        >
          <UserCheck size={16} />
          {updateActivityLoading ? "Please wait.." : "Unban User"}
        </button>
      </td>
    </tr>
  );
};

export const BannedUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bannedUsersData, isLoading: bannedUsersLoading } =
    useGetBannedUsersQuery(undefined);
  const [updateActivityZone, { isLoading: updateActivityLoading }] =
    useUpdateActivityZoneMutation();
  const bannedUsers = bannedUsersData?.result?.users;

  const filteredUsers = useMemo(() => {
    return bannedUsers
      ? bannedUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];
  }, [searchTerm, bannedUsers]);

  if (bannedUsersLoading) {
    return <div>Loading...</div>;
  }
  console.log({ bannedUsersData });

  const handleUnban = async (id: string) => {
    const payload = {
      id: id,
      zone: "safe",
      date_till: "",
    };

    try {
      const res = await updateActivityZone(payload).unwrap();
      console.log("API success:", res);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/">
              <div className="flex items-center gap-2 text-slate-500 mb-2 cursor-pointer hover:text-indigo-600 transition-colors">
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Banned Live Lists
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-md">
                {bannedUsersData?.result?.pagination?.total
                  ? bannedUsersData?.result?.pagination?.total
                  : 0}
              </span>
            </h1>
            <p className="text-slate-500 mt-1">
              Manage users who have been restricted from live streaming
              privileges.
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-11 pr-4 py-3 w-full md:w-80 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onUnban={handleUnban}
                      updateActivityLoading={updateActivityLoading}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <ShieldAlert size={32} className="text-slate-300" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold text-lg">
                            No Banned Users Found
                          </p>
                          <p className="text-slate-400 text-sm">
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
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-tighter">
              <span>Showing {filteredUsers.length} restricted accounts</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live Enforcement Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
