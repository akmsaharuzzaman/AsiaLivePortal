import React from "react";
import { useGetLatestReleaseQuery } from "@/redux/api/admin/release.api";
import { Link, useNavigate } from "react-router-dom";
import { ActionTinyButton } from "@/components/buttons/action-tiny-buttons";

const VersionManagementPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetLatestReleaseQuery();
  const release = data || null;
  console.log("Latest release data:", release);
  console.log(data)
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Version Management</h1>
        <div className="flex gap-3">
          <ActionTinyButton variant="primary" onClick={() => refetch()}>Refresh</ActionTinyButton>
          {!release && (
            <Link to="/create-version">
              <ActionTinyButton variant="primary">Create Version</ActionTinyButton>
            </Link>
          )}
          {release && (
            <ActionTinyButton variant="primary" onClick={() => navigate("/update-version")}>Update Version</ActionTinyButton>
          )}
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : !release ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded">No version data found. Create latest release.</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-muted-foreground">Current Version</h3>
              <div className="text-lg font-medium">{release.version}</div>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Minimum Supported Version</h3>
              <div className="text-lg font-medium">{release.minimumVersion}</div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm text-muted-foreground">Download URL</h3>
              <div>
                <a href={release.DownloadURL} target="_blank" rel="noreferrer" className="text-blue-600 underline">{release.DownloadURL}</a>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm text-muted-foreground">Release Note</h3>
              <div className="mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-4 rounded">{release.Release_note}</div>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Last Updated</h3>
              <div className="text-sm">{release.updatedAt ? new Date(release.updatedAt).toLocaleString() : "-"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionManagementPage;
