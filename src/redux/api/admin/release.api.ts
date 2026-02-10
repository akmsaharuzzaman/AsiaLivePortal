import { onuliveCloneDashboardBaseApi } from "../base.api";
import { tagTypes } from "@/redux/tag.types";

const releaseApi = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestRelease: builder.query<any, void>({
      query: () => ({ url: "/release/latest", method: "GET" }),
      providesTags: [tagTypes.release],
    }),
    createLatestRelease: builder.mutation<any, { version: string; minimumVersion: string; DownloadURL: string; Release_note: string }>({
      query: (body) => ({ url: "/release/latest", method: "POST", body }),
      invalidatesTags: [tagTypes.release],
    }),
    updateLatestRelease: builder.mutation<any, Partial<{ version: string; minimumVersion: string; DownloadURL: string; Release_note: string }>>({
      query: (body) => ({ url: "/release/latest", method: "PUT", body }),
      invalidatesTags: [tagTypes.release],
    }),
  }),
});

export const { useGetLatestReleaseQuery, useCreateLatestReleaseMutation, useUpdateLatestReleaseMutation } = releaseApi;

export default releaseApi;
