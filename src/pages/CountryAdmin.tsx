import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { CountryAdminTable } from "@/components/pages/country-admin/table-list";
import { SearchBar } from "@/components/shared/search-bar";
import { useGetCountryAdminQuery } from "@/redux/api/power-shared";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CountryAdmin = () => {
  const [q, setQ] = useState("");
  const { data: countryAdminRes, isLoading } = useGetCountryAdminQuery({});
  const countryAdminData = countryAdminRes?.result?.data || [];
  const filtered = useMemo(
    () =>
      countryAdminData.filter((u) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return [u.name, u.email, u.uid].some((v) =>
          (v || "").toLowerCase().includes(s)
        );
      }),
    [countryAdminData, q]
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Country Admins List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar onChange={setQ} />
          <Link to="/create-country-admin">
            <ActionTinyButton variant="primary">
              Create Country Admin
            </ActionTinyButton>
          </Link>
        </div>
      </div>

      {countryAdminData.length === 0 ? (
        <div className="p-12 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No country-admins found.
            <br />
            Please create a country-admin to manage your platform.
          </p>
          <Link to="/create-country-admin">
            <ActionTinyButton variant="primary">
              Create Country Admin
            </ActionTinyButton>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No Country Admin matched your search.
          </p>
          <Link to="/create-country-admin">
            <ActionTinyButton variant="primary">
              Create Country Admin
            </ActionTinyButton>
          </Link>
        </div>
      ) : (
        <CountryAdminTable data={countryAdminData} />
      )}
    </div>
  );
};

export default CountryAdmin;
