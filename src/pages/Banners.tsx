
import { useGetBannerDocsQuery } from "@/redux/api/admin/banners";
import { BannerCard } from "@/components/pages/banners/banner-card";
import { Link, useNavigate } from "react-router-dom";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";

const BannersPage = () => {
  const { data, isLoading, isFetching, refetch } = useGetBannerDocsQuery();
  const banners = data?.result || [];
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Banners</h1>
        <div className="flex gap-3">
          <ActionTinyButton variant="primary" onClick={() => refetch()}>
            {isFetching ? "Refreshing..." : "Refresh"}
          </ActionTinyButton>
          <Link to="/create-banner">
            <ActionTinyButton variant="primary">Create Banner</ActionTinyButton>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div>Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded">No banners found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {banners.map((b: any) => (
            <BannerCard
              key={b._id}
              banner={b}
              onDeleted={() => refetch()}
              onEdit={(id) => navigate(`/update-banner/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersPage;
