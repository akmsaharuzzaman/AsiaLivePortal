import { TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "./base.api";

import { TGetRequestForAgency } from "@/types/api/become-agency";

type TGetRequestForAgencyResponse = TResponse<TGetRequestForAgency>;
const becomeAgency = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestForAgencyResponse: builder.query<
      TGetRequestForAgencyResponse,
      void
    >({
      query: () => ({
        url: "/become-agency/requests/agency",
        method: "GET",
      }),
      // providesTags: [tagTypes.diamondWithdrawals],
    }),

    acceptRequest: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/become-agency/request/${userId}/accept`,
        method: "PUT",
      }),
    }),
    rejectRequest: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: `/become-agency/request/${userId}/reject`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetRequestForAgencyResponseQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} = becomeAgency;
