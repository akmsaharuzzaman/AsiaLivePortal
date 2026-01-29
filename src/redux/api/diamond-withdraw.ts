import { Tpagination, TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "./base.api";

import { tagTypes } from "../tag.types";
import { TDiamondBankWithdraw } from "@/types/api/diamond-withdrawals";



type TUnapprovedBankWithdrawsResponse = TResponse<{
  pagination: Tpagination;
  data: TDiamondBankWithdraw[];
}>;
const diamondWihdraws = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    approvedBankWithdrawals: builder.query<
      TUnapprovedBankWithdrawsResponse,
      void
    >({
      query: () => ({
        url: "/diamond-withdraw/get-admin-approved-withdraws",
        method: "GET",
      }),
      providesTags: [tagTypes.diamondWithdrawals],
    }),
    unapprovedBankWithdraws: builder.query<
      TUnapprovedBankWithdrawsResponse,
      void
    >({
      query: () => ({
        url: "/diamond-withdraw/get-unapproved-bank-withdraws",
        method: "GET",
      }),
      providesTags: [tagTypes.diamondWithdrawals],
    }),

    adminApproveBankWithdraw: builder.mutation<
      any,
      { diamondWIthdrawId: string }
    >({
      query: ({diamondWIthdrawId}) => ({
        url: `/diamond-withdraw/admin-approve-bank-withdraw/${diamondWIthdrawId}`,
        method: "PUT",
      }),
      invalidatesTags: [tagTypes.diamondWithdrawals],
    }),
    merchantSelfAssign: builder.mutation<
      any,
      { diamondWIthdrawId: string }
    >({
      query: ({diamondWIthdrawId}) => ({
        url: `/diamond-withdraw/assign-marchent-to-withdraw/${diamondWIthdrawId}`,
        method: "PUT",
      }),
      invalidatesTags: [tagTypes.diamondWithdrawals],
    }),
    specificMerchantAssignedDiamondWithdrawals: builder.query<
      TUnapprovedBankWithdrawsResponse, //response
      void
    >({
      query: () => ({
        url: "/diamond-withdraw/get-merchant-assigned-withdraws",
        method: "GET",
      }),
      providesTags: [tagTypes.diamondWithdrawals],
    }),
    updateWithdrawPaidStatus: builder.mutation<
      any,
      { diamondWIthdrawId: string }
    >({
      query: ({diamondWIthdrawId}) => ({
        url: `/diamond-withdraw/update-withdraw-paid-status/${diamondWIthdrawId}`,
        method: "PUT",
      }),
      invalidatesTags: [tagTypes.diamondWithdrawals],
    }),
  }),
});

export const { useApprovedBankWithdrawalsQuery,
  useUnapprovedBankWithdrawsQuery,
  useAdminApproveBankWithdrawMutation,
  useMerchantSelfAssignMutation,
  useSpecificMerchantAssignedDiamondWithdrawalsQuery,
  useUpdateWithdrawPaidStatusMutation
} = diamondWihdraws;
