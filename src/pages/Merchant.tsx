import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { MerchantTable } from "@/components/pages/merchants/table-list";
import { SearchBar } from "@/components/shared/search-bar";
import { useGetMerchantsQuery } from "@/redux/api/power-shared";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Merchant = () => {
  const [q, setQ] = useState("");

  const { data: merchantRes, isLoading } = useGetMerchantsQuery({});
  const merchants = merchantRes?.result?.data || [];
  const merchantData = merchants ? [...merchants].sort((a, b) => {
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }) : [];
  const filtered = useMemo(
    () =>
      merchantData.filter((u) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return [u.name, u.email, u.uid].some((v) =>
          (v || "").toLowerCase().includes(s)
        );
      }),
    [merchantData, q]
  );

  if (isLoading) return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        className="flex justify-between items-center mb-4"
      >
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Merchants List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar onChange={setQ} />
          <Link to="/create-merchant">
            <ActionTinyButton variant="primary">
              Create Merchant
            </ActionTinyButton>
          </Link>
        </div>
      </div>

      {merchantData.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No merchant found.
            <br />
            Please create a merchant to manage your platform.
          </p>
          <Link to="/create-merchant">
            <ActionTinyButton variant="primary">
              Create Merchant
            </ActionTinyButton>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No merchant matched your search.
          </p>
          <Link to="/create-merchant">
            <ActionTinyButton variant="primary">
              Create Merchant
            </ActionTinyButton>
          </Link>
        </div>
      ) : (
        <MerchantTable data={merchantData} />
      )}
    </div>
  );
};

export default Merchant;
