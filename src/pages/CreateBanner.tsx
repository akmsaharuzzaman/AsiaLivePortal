import React from "react";
import { CreateUpdateBannerForm } from "@/components/forms/create-update-banner-form";
import { BackRouteHeader } from "@/components/shared/back-route-header";
import { useNavigate } from "react-router-dom";

export const CreateBannerPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Banner</h1>
        <BackRouteHeader backRoute="/banners" />
      </div>
      <div className="space-y-4">
        <CreateUpdateBannerForm mode="create" onSuccess={() => navigate("/banners")} />
      </div>
    </div>
  );
};

export default CreateBannerPage;
