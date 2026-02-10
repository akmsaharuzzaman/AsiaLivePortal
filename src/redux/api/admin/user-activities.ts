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
    updatePermissionById: builder.mutation({
      query: (payload: {
        userId: string;
        permissions: string[];
      }) => ({
        url: "/admin/users/remove-permissions",
        method: "PUT",
        body: {
          userId: payload.userId,
          permissions: payload.permissions,
        },
      }),
    }),

  }),
});

export const { useUpdateActivityZoneMutation, useGetBannedUsersQuery, useUpdatePermissionByIdMutation } =
  userActivityApi;
