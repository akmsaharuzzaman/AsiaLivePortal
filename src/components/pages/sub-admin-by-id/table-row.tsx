import { ClientRoutes } from "@/constants/route.enum";
import { RoleContext } from "@/provider/role-provider";
import { TUser } from "@/types/api/auth";
import { useContext } from "react";
import { Link } from "react-router-dom";

export const RenderAgencyRow = (user: TUser) => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("Sub-admin lists table must be used within a RoleProvider");
  }
  const { role } = context;
  return (
    <>
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatar ||
              `https://placehold.co/600x400/caf0f8/000000/png?text=${
                user?.name?.charAt(0) || "U"
              }`
            }
            alt="Avatar"
            className="h-11 w-11 rounded-full ring-2 ring-gray-200 dark:ring-gray-600"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</div>
            <div className="mt-1 inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300">
              {user?.userRole}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 font-mono text-xs text-gray-700 dark:text-gray-300">
        {user?.userId}
      </td>
      <td className="px-6 py-5">{user?.gender}</td>
      <td className="px-6 py-5 text-gray-500 dark:text-gray-400 italic">
        {user?.country || "N/A"}
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-yellow-500 dark:text-yellow-400">
            <span className="text-base">🪙</span> {user?.stats?.coins || 0}
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-400 dark:text-blue-300">
            <span className="text-base">💎</span> {user?.stats?.diamonds || 0}
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="inline-block rounded-md bg-yellow-100 dark:bg-yellow-900 px-2 py-1 text-xs text-yellow-800 dark:text-yellow-200">
          {user?.stats?.levels || 0}
        </span>
      </td>
      <td
        className={`px-6 py-5 font-medium capitalize ${
          user?.activityZone?.zone === "safe"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {user?.activityZone?.zone}
      </td>
      <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium text-gray-800 dark:text-gray-200">Joined:</span>{" "}
          {new Date(user?.createdAt)?.toLocaleDateString()}
        </div>
        <div>
          <span className="font-medium text-gray-800 dark:text-gray-200">Updated:</span>{" "}
          {new Date(user?.updatedAt)?.toLocaleDateString()}
        </div>
        <div className="mt-1 font-mono text-xs text-gray-400 dark:text-gray-500">
          ID: {user?._id}
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        {role === "sub-admin" ? (
          ""
        ) : (
          <Link
            to={`${ClientRoutes.Agencies}/${user?._id}`}
            title="View Details"
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 
              4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
        )}
      </td>
    </>
  );
};
