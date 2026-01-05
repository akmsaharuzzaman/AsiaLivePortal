// -----------------------------
// Color palette & small helpers

import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { SubAdminTable } from "@/components/pages/sub-admin/table-list";
import { useGetSubAdminsQuery } from "@/redux/api/power-shared";
import { Dispatch, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// -----------------------------

// const formatDate = (iso) => {
//   try {
//     return new Date(iso).toLocaleDateString();
//   } catch (e) {
//     return "—";
//   }
// };

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="flex gap-2 items-center">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search users by name, email or uid..."
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
    />
    <button
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100"
    >
      🔎
    </button>
  </div>
);

const SubAdmin = () => {
  const [q, setQ] = useState("");
  const { data: subAdminRes, isLoading } = useGetSubAdminsQuery({});
  const subAdmins = subAdminRes?.result?.data || [];
  const subAdminData = subAdmins ? [...subAdmins].sort((a, b) => {
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }) : [];
  const filtered = useMemo(
    () =>
      subAdminData.filter((u) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return [u.name, u.email, u.uid].some((v) =>
          (v || "").toLowerCase().includes(s)
        );
      }),
    [subAdminData, q]
  );

  if (isLoading) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>; // You can replace this with a spinner or skeleton loader
  }
  // const onCreate = () => {
  //   // Logic to handle user creation
  //   console.log("Create User button clicked");
  //   alert("Create User button clicked");
  // };
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        className="flex justify-between items-center mb-4"
      >
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Sub Admin List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={q} onChange={setQ} />
          <Link to="/create-sub-admin">
            <ActionTinyButton variant="primary">
              Create Sub-admin
            </ActionTinyButton>
          </Link>
        </div>
      </div>

      {subAdminData.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No sub-admins found.
            <br />
            Please create a sub-admin to manage your platform.
          </p>
          <Link to="/create-sub-admin">
            <ActionTinyButton variant="primary">
              Create Sub-admin
            </ActionTinyButton>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No sub-admin matched your search.
          </p>
          <Link to="/create-sub-admin">
            <ActionTinyButton variant="primary">
              Create Sub-admin
            </ActionTinyButton>
          </Link>
        </div>
      ) : (
        <SubAdminTable data={subAdminData} />
      )}
    </div>
  );
};

export default SubAdmin;
