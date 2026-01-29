import { selectUser } from "@/redux/features/auth.slice";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useGetPortalProfileQuery } from "@/redux/api/power-shared";
import { ACTIVITY_ZONES } from "@/constants/constant";
import {
  useAcceptRequestMutation,
  useGetRequestForAgencyResponseQuery,
  useRejectRequestMutation,
} from "@/redux/api/become-agency";
import { useEffect, useState } from "react";
import { AgencyRequestModal } from "../dialog";
import { toast } from "sonner";

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectUser);

  const [showAgencyModal, setShowAgencyModal] = useState(false);

  const isAdmin = user?.role === "admin";
  const isAgency = user?.role === "agency";
  // ✅ Safe way: hook always runs, but query is skipped if admin
  const {
    data: portalProfile,
    isLoading,
    isFetching,
  } = useGetPortalProfileQuery(undefined, {
    skip: isAdmin, // prevents the API call, hook still mounted
  });
  const { data: getAgencyRequest } = useGetRequestForAgencyResponseQuery(
    undefined,
    { skip: !isAgency },
  );
  const [acceptAgencyRequest, { isLoading: acceptLoading }] =
    useAcceptRequestMutation();
  const [rejectAgencyRequest, { isLoading: rejectLoading }] =
    useRejectRequestMutation();

  // Trigger Modal when Agency role is selected and request exists
  useEffect(() => {
    if (isAgency && getAgencyRequest) {
      setShowAgencyModal(true);
    } else {
      setShowAgencyModal(false);
    }
  }, [isAgency, getAgencyRequest]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorize" replace />;
  }

  // Only show loader if the query actually runs
  if (!isAdmin && (isLoading || isFetching)) {
    return <h1>Please wait for your profile...</h1>;
  }

  // Restrict based on API result (only for non-admin users)
  if (
    !isAdmin &&
    portalProfile?.result?.activityZone?.zone !== ACTIVITY_ZONES.SAFE
  ) {
    return <Navigate to="/restrict" replace />;
  }

  const handleAgencyAccept = async (userId: string) => {
    // On success or accept, we clear the request and close modal
    try {
      const res = await acceptAgencyRequest({ userId }).unwrap();
      toast.success(res.message || "Request accepted");
      setShowAgencyModal(false);
    } catch (error: any) {
      toast.error(
        error.data.message ||
          error.message ||
          "Something went wrong to accept request",
      );
    }
  };
  const handleAgencyReject = async (userId: string) => {
    // On success or reject, we clear the request and close modal
    try {
      const res = await rejectAgencyRequest({ userId }).unwrap();
      toast.success(res.message || "Request rejected");
      setShowAgencyModal(false);
    } catch (error: any) {
      toast.error(
        error.data.message ||
          error.message ||
          "Something went wrong to reject request",
      );
    }
  };

  return (
    <>
      {children}
      <AgencyRequestModal
        agencyRequest={getAgencyRequest}
        handleAgencyAccept={handleAgencyAccept}
        handleAgencyReject={handleAgencyReject}
        showAgencyModal={showAgencyModal}
        acceptLoading={acceptLoading}
        rejectLoading={rejectLoading}
      />
    </>
  );
}
