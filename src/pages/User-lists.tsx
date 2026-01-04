import { useState } from "react";
import { UserTable } from "@/components/tables";

import { ShadcnPagination } from "@/components/ui/shadcn-pagination";
import { userData } from "@/assets/data/user-data";
import { TUser } from "@/types/api/auth";
import { useGetUsersQuery } from "@/redux/api/power-shared";

const PAGE_LIMIT = 8;

export const UserListsPage = () => {
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading } = useGetUsersQuery({
    page,
    limit: PAGE_LIMIT,
  });

  const totalPage = usersData?.result?.pagination?.totalPage || 1;
  // const users = usersData?.result?.users || [];
  const users = usersData?.result?.users || userData;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Lists</h1>
      </div>
      <UserTable usersData={users as TUser[]} isLoading={isLoading} />
      <ShadcnPagination
        page={page}
        totalPages={totalPage}
        onPageChange={setPage}
        maxButtons={5}
      />
    </div>
  );
};
