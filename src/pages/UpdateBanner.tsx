import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackRouteHeader } from "@/components/shared/back-route-header";
import { CreateUpdateBannerForm } from "@/components/forms/create-update-banner-form";
import { useGetBannerDocsQuery } from "@/redux/api/admin/banners";

const UpdateBannerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetBannerDocsQuery();
  const banners = data?.result || [];
  const banner = banners.find((b: any) => b._id === id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Update Banner</h1>
        <BackRouteHeader backRoute="/banners" />
      </div>
      <div className="space-y-4">
        {banner ? (
          <CreateUpdateBannerForm initial={banner} mode="update" onSuccess={() => navigate("/banners")} />
        ) : (
          <div>Banner not found.</div>
        )}
      </div>
    </div>
  );
};

export default UpdateBannerPage;
