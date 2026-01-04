import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";
import { MerchantByIdTable } from "@/components/pages/merchants-by-id/table-list";
import { SearchBar } from "@/components/shared/search-bar";
import { colors } from "@/constants/constant";
import { ClientRoutes, Roles } from "@/constants/route.enum";
import { useGetMidPortalManagementQuery } from "@/redux/api/power-shared";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const MerchantById = () => {
  const [q, setQ] = useState("");

  const { merchantId } = useParams();
  const {
    data: resellerRes,
    error,
    isLoading,
  } = useGetMidPortalManagementQuery({
    type: Roles.Reseller,
    id: merchantId!,
    searchTerm: q,
  });
  if (isLoading) return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">Error occurred: {(error as any).message}</div>;
  const resellers = resellerRes?.result?.data || [];
  const resellerData = resellers
    ? [...resellers].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : [];
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        className="flex justify-between items-center mb-4"
      >
        <h3
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          All Resellers List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar onChange={setQ} />
          <Link to={`${ClientRoutes.CreateReseller}/${merchantId}`}>
            <ActionTinyButton variant="primary">
              Create Reseller
            </ActionTinyButton>
          </Link>
        </div>
      </div>

      {resellerData.length === 0 ? (
        <div
          className="p-12 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4 w-1/2 mx-auto">
            "No resellers matched your search. You can create a new reseller
            by clicking the button below."
          </p>
          <Link to={`${ClientRoutes.CreateReseller}/${merchantId}`}>
            <ActionTinyButton variant="primary">
              Create Reseller
            </ActionTinyButton>
          </Link>
        </div>
      ) : (
        <MerchantByIdTable data={resellerData} />
      )}
    </div>
  );
};

export default MerchantById;
