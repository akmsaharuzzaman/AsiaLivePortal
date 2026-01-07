import { countryAdminData } from "@/assets/data/country-admin";
import { subCountryAdminData } from "@/assets/data/sub-country-admin";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { CountryAdminTable } from "@/components/pages/country-admin/table-list";
import { SearchBar } from "@/components/shared/search-bar";
import { useMemo, useState } from "react";

const CountryAdminById = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      subCountryAdminData.filter((u) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return [u.name, u.email, u.uid].some((v) =>
          (v || "").toLowerCase().includes(s)
        );
      }),
    [q]
  );
  const onCreate = () => {
    // Logic to handle user creation
    alert("Create Sub Country Admin User button clicked");
  };
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        className="flex justify-between items-center mb-4"
      >
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Sub Country Admins List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar onChange={setQ} />
          <ActionTinyButton onClick={onCreate} variant="primary">
            Create Sub Country Admin
          </ActionTinyButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No Sub Country Admin matched your search.
          </p>
          <ActionTinyButton onClick={onCreate} variant="primary">
            Create Sub Country Admin
          </ActionTinyButton>
        </div>
      ) : (
        <CountryAdminTable data={countryAdminData} />
      )}
    </div>
  );
};

export default CountryAdminById;
