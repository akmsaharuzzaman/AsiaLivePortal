// -----------------------------
// Color palette & small helpers

import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { AgencyTable } from "@/components/pages/sub-admin-by-id/table-list";
import { colors } from "@/constants/constant";
import { ClientRoutes, Roles } from "@/constants/route.enum";
import { useGetMidPortalManagementQuery } from "@/redux/api/power-shared";
import { Dispatch, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

const SubAdminById = () => {
  const { subAdminId } = useParams();

  const [q, setQ] = useState("");

  const { data: subAdminRes, isLoading } = useGetMidPortalManagementQuery({
    type: Roles.Agency,
    id: subAdminId!,
    searchTerm: q,
  });

  const agencies = subAdminRes?.result?.data || [];
  const agenciesData = agencies
    ? [...agencies].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : [];
  // const filtered = useMemo(
  //   () =>
  //     subAdminData.filter((u) => {
  //       const s = q.trim().toLowerCase();
  //       if (!s) return true;
  //       return [u.name, u.email, u.uid].some((v) =>
  //         (v || "").toLowerCase().includes(s)
  //       );
  //     }),
  //   [q]
  // );

  if (!subAdminId) {
    return <div className="text-red-600 dark:text-red-400">Sub Admin ID is required</div>;
  }
  if (isLoading) return <div className="text-gray-900 dark:text-gray-100"> Agency Lists is Loading...</div>;
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        className="flex justify-between items-center mb-4"
      >
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Agency List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={q} onChange={setQ} />
          <Link to={`${ClientRoutes.CreateAgency}/${subAdminId}`}>
            <ActionTinyButton variant="primary">Create Agency</ActionTinyButton>
          </Link>
        </div>
      </div>

      {agenciesData.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No agency matched your search.
          </p>
          <Link to={`${ClientRoutes.CreateAgency}/${subAdminId}`}>
            <ActionTinyButton variant="primary">Create Agency</ActionTinyButton>
          </Link>
        </div>
      ) : (
        <AgencyTable data={agenciesData} />
      )}
    </div>
  );
};

export default SubAdminById;
