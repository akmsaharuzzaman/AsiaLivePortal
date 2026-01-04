import { ModeratorTable } from "@/components/tables/moderator-tables";
import { useGetAllModeratorUsersQuery } from "@/redux/api/moderator.api";

export const ModeratorListsPage = () => {
  const { data: moderatorsData, isLoading } =
    useGetAllModeratorUsersQuery(null);
  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-4 max-w-xs">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Moderator Lists</h1>
      </div>
      <ModeratorTable
        moderatorsData={moderatorsData?.result?.users}
        isLoading={isLoading}
      />
    </div>
  );
};
