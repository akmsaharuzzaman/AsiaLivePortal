import { ACTIVITY_ZONES } from "@/constants/constant";
import { useGetPortalProfileQuery } from "@/redux/api/power-shared";
import { selectUser } from "@/redux/features/auth.slice";
import { useAppSelector } from "@/redux/hooks";
import { Navigate } from "react-router-dom";

// Mock Lucide icon (Lock for unauthorized access)
const Lock = ({ className }: { className: string }) => (
  <span className={className} role="img" aria-label="Lock icon">
    🔒
  </span>
);

const RestrictPage = () => {
  const user = useAppSelector(selectUser);

  const isAdmin = user?.role === "admin";

  // ✅ Safe way: hook always runs, but query is skipped if admin
  const {
    data: portalProfile,
    isLoading,
    isFetching,
  } = useGetPortalProfileQuery(undefined, {
    skip: isAdmin, // prevents the API call, hook still mounted
  });

  // Only show loader if the query actually runs
  if (!isAdmin && (isLoading || isFetching)) {
    return <h1 className="text-gray-900 dark:text-gray-100">Please wait for your profile...</h1>;
  }
  // Restrict based on API result (only for non-admin users)
  if (
    // !isAdmin &&
    portalProfile?.result?.activityZone?.zone == ACTIVITY_ZONES.SAFE
  ) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="unauthorized-card max-w-md w-full text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <Lock className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Restricted Access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have{" "}
          <span className="text-red-400 dark:text-red-300 font-medium">estricted/blocked</span> to
          access this website. Please wait for unblock account or contact
          support for assistance.
        </p>
        {/*<div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ActionTinyButton
            onClick={() => (window.location.href = "/login")}
            className="btn-gradient"
          >
            Log In
          </ActionTinyButton>
          <ActionTinyButton
            onClick={() => (window.location.href = "/")}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Back to Home
          </ActionTinyButton>
        </div>*/}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Need help?{" "}
          <a
            href="mailto:support@gameapp.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default RestrictPage;
