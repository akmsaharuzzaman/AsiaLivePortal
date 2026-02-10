import React from "react";
import { BackRouteHeader } from "@/components/shared/back-route-header";
import VersionForm from "@/components/forms/version-form";
import { useCreateLatestReleaseMutation } from "@/redux/api/admin/release.api";
import { useNavigate } from "react-router-dom";

export const CreateVersionPage: React.FC = () => {
  const [create, { isLoading }] = useCreateLatestReleaseMutation();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    await create(values).unwrap();
    navigate("/version-management");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Version</h1>
        <BackRouteHeader backRoute="/version-management" />
      </div>
      <div className="space-y-4">
        <VersionForm onSubmit={onSubmit} submitLabel="Create Version" loading={isLoading} />
      </div>
    </div>
  );
};

export default CreateVersionPage;
