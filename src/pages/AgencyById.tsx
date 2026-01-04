import { HostTable } from "@/components/pages/agency-by-id/table-list";
import { colors } from "@/constants/constant";
import { useLowerPortalManagementQuery } from "@/redux/api/power-shared";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

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
      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    />
    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
      🔎
    </button>
  </div>
);

const AgencyById = () => {
  const [q, setQ] = useState("");
  const { agencyId } = useParams();
  const {
    data: hostsRes,
    error,
    isLoading,
  } = useLowerPortalManagementQuery({
    // type: Roles.Host,
    id: agencyId!,
    searchTerm: q,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {(error as any).message}</div>;
  const hostData = hostsRes?.result?.users || [];
console.log({hostData});
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Host List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={q} onChange={setQ} />
          {/* <Link to={ClientRoutes.Hosts}>
            <ActionTinyButton variant="primary">Create Host</ActionTinyButton>
          </Link> */}
        </div>
      </div>

      {hostData.length === 0 ? (
        <div className="p-12 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No hosts matched your search.
          </p>
          {/* <Link to={ClientRoutes.Hosts}>
            <ActionTinyButton variant="primary">Create Host</ActionTinyButton>
          </Link> */}
        </div>
      ) : (
        <HostTable data={hostData} />
      )}
    </div>
  );
};

export default AgencyById;
