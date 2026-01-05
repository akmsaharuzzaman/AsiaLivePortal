import { UserTable } from "@/components/pages/users/table-list";
import { AppPagination } from "@/components/shared/pagination";
import { SearchBar } from "@/components/shared/search-bar";
import { useGetUsersQuery } from "@/redux/api/power-shared";
import { useState } from "react";
const PAGE_LIMIT = 10;
const initialPage = 1;
const Users = () => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [q, setQ] = useState("");

  const { data: userResponse, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    searchTerm: q,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!userResponse || !userResponse.result) {
    return <div>No user data found.</div>;
  }

  console.log(userResponse, "userResponse");
  const users = userResponse?.result?.users || [];
  const userData = users
    ? [...users].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : [];

  console.log(userData, "userResponse");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          All Users List
        </h3>
        <div className="flex gap-3 items-center">
          <SearchBar onChange={setQ} />
        </div>
      </div>

      {userData.length === 0 ? (
        <div className="p-12 bg-white dark:bg-gray-800 rounded-xl text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No users matched your search.
          </p>
        </div>
      ) : (
        <UserTable data={userData} />
      )}

      <div className="w-full max-w-xl mx-auto mt-8">
        <AppPagination
          totalPages={userResponse.result?.pagination?.totalPage || 1}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Users;
