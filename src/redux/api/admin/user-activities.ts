import { onuliveCloneDashboardBaseApi } from "../base.api";

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
  }),
});

export const { useUpdateActivityZoneMutation } = userActivityApi;
