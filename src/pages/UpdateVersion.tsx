import React from "react";
import { BackRouteHeader } from "@/components/shared/back-route-header";
import VersionForm from "@/components/forms/version-form";
import { useGetLatestReleaseQuery, useUpdateLatestReleaseMutation } from "@/redux/api/admin/release.api";
import { useNavigate } from "react-router-dom";

export const UpdateVersionPage: React.FC = () => {
  const { data, isLoading } = useGetLatestReleaseQuery();
  const release = data || null;
  const [update, { isLoading: isUpdating }] = useUpdateLatestReleaseMutation();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    await update(values).unwrap();
    navigate("/version-management");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Update Version</h1>
        <BackRouteHeader backRoute="/version-management" />
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : release ? (
          <VersionForm initial={release} onSubmit={onSubmit} submitLabel="Update Version" loading={isUpdating} />
        ) : (
          <div>No release found.</div>
        )}
      </div>
    </div>
  );
};

export default UpdateVersionPage;
