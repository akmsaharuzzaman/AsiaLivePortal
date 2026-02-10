import { onuliveCloneDashboardBaseApi } from "../base.api";
import { tagTypes } from "@/redux/tag.types"; 

const bannersApi = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBannerDocs: builder.query<any, void>({
      query: () => ({ url: "/admin/banners/docs", method: "GET" }),
      providesTags: [tagTypes.banner],
    }),
    createBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.banner],
    }),
    updateBanner: builder.mutation<any, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/admin/banners/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [tagTypes.banner],
    }),
    deleteBanner: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/admin/banners/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.banner],
    }),
  }),
});

export const {
  useGetBannerDocsQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;

export default bannersApi;
