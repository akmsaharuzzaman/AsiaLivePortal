import { Tpagination, TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "../base.api";
import { TUser } from "@/types/api/auth";

type TGetBannedUsers = TResponse<{
  pagination: Tpagination;
  users: TUser[];
}>;
const userActivityApi = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateActivityZone: builder.mutation({
      query: (activityZonePayload: {
        id: string;
        zone: string;
        date_till: string;
      }) => ({
        url: "/admin/users/activity-zone",
        method: "PUT",
        body: {
          id: activityZonePayload.id,
          zone: activityZonePayload.zone,
          date_till: activityZonePayload.date_till,
        },
      }),
    }),
    getBannedUsers: builder.query<TGetBannedUsers, undefined>({
      query: () => ({
        url: `/admin/users/banned-users`,
        method: "GET",
      }),
    }),
  }),
});

export const { useUpdateActivityZoneMutation, useGetBannedUsersQuery } =
  userActivityApi;
