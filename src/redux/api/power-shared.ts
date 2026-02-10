import { Tpagination, TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "./base.api";
import { TUser } from "@/types/api/auth";
import {
  TAsignCoinToUserRequestBody,
  TCreateHost,
  TUserRewards,
} from "@/types/api/user";
import { tagTypes } from "../tag.types";
import { Roles } from "@/constants/route.enum";
import { TApplyWithdrawBody, TPortalLoginBody } from "@/types/api/power-shared";

type TGetUserResponse = TResponse<{ pagination: Tpagination; users: TUser[] }>;
type TAsignCoinToUserResponse = TResponse<TUserRewards>;
type TPortalLoginResponse = TResponse<TUser> & { access_token: string };

const sharedPowerApi = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    portalLogin: builder.mutation<TPortalLoginResponse, TPortalLoginBody>({
      query: (userInfo) => ({
        url: "/power-shared/auth",
        method: "POST",
        body: userInfo,
      }),
    }),
    getPortalProfile: builder.query<TResponse<TUser>, void>({
      query: () => ({
        url: "/power-shared/auth",
        method: "GET",
      }),
      providesTags: [tagTypes.user, tagTypes.coin],
    }),
    getUsers: builder.query<
      TGetUserResponse,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, searchTerm } = {}) => ({
        url: `/power-shared/users?page=${page}&limit=${limit}&searchTerm=${
          searchTerm || ""
        }`,
        method: "GET",
      }),
      providesTags: [tagTypes.user, tagTypes.coin],
    }),
    asignCoinToUserById: builder.mutation<
      TAsignCoinToUserResponse,
      TAsignCoinToUserRequestBody
    >({
      query: (userInfo) => ({
        url: "/power-shared/users/assign-coin",
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.coin],
    }),
    searchUsersByEmail: builder.query<
      TResponse<{
        users: TUser[];
        paginations: Tpagination;
      }>,
      { email: string; page?: number; limit?: number }
    >({
      query: ({ email, page = 1, limit = 5 }) => ({
        url: `/power-shared/users?searchTerm=${encodeURIComponent(
          email,
        )}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    // top portal management
    getSubAdmins: builder.query<
      TResponse<{ pagination: Tpagination; data: TUser[] }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 9999 } = {}) => ({
        url: `/power-shared/portal/sub-admin?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getMerchants: builder.query<
      TResponse<{ pagination: Tpagination; data: TUser[] }>,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 9999, searchTerm = "" }) => ({
        url: `/power-shared/portal/merchant?page=${page}&limit=${limit}&searchTerm=${
          searchTerm || ""
        }`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getCountryAdmin: builder.query<
      TResponse<{ pagination: Tpagination; data: TUser[] }>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 9999 } = {}) => ({
        url: `/power-shared/portal/country-admin?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    // mid portal management
    getTopPortalManagement: builder.query<
      TResponse<{ data: TUser[]; pagination: Tpagination }>,
      {
        type: Roles;
        // id: string;
        searchTerm?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ type, searchTerm, page = 1, limit = 9999 }) => {
        const url = `/power-shared/portal/${type}`;
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }
        return {
          url: `${url}?${params.toString()}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),
    // mid portal management
    getMidPortalManagement: builder.query<
      TResponse<{ data: TUser[]; pagination: Tpagination }>,
      {
        type: Roles;
        id: string;
        searchTerm?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ type, id, searchTerm, page = 1, limit = 9999 }) => {
        const url = `/power-shared/portal/mid/${type}/${id}`;
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }
        return {
          url: `${url}?${params.toString()}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),

    // lower portal management
    lowerPortalManagement: builder.query<
      TResponse<{ users: TUser[]; pagination: Tpagination }>,
      {
        // type: Roles;
        id: string;
        searchTerm?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ id, searchTerm, page = 1, limit = 9999 }) => {
        const url = `/power-shared/portal/lower/${id}`;
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }
        return {
          url: `${url}?${params.toString()}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.user],
    }),

    // getSubCountryAdminsByCountryAdminId: builder.query<
    //   TResponse<{ pagination: Tpagination; data: TUser[] }>,
    //   { merchantId:string, page?: number; limit?: number }
    // >({
    //   query: ({ merchantId, page = 1, limit = 10 }) => ({
    //     url: `/power-shared/portal/mid/agency/${merchantId}?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypes.user],
    // }),

    createHost: builder.mutation<TAsignCoinToUserResponse, TCreateHost>({
      query: (userInfo) => ({
        url: "/power-shared/users/promote",
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    agencyApplyWithdraw: builder.mutation<TResponse<any>, TApplyWithdrawBody>({
      query: (userInfo) => ({
        url: "/power-shared/agency/withdraw",
        method: "POST",
        body: userInfo,
      }),
      // invalidatesTags: [tagTypes.user],
    }),
    deleteAgencyById: builder.mutation<TResponse<any>, {agencyId: string}>({
      query: ({agencyId}) => ({
        url: `power-shared/portal-user/agency/${agencyId}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  usePortalLoginMutation,
  useGetPortalProfileQuery,
  useGetUsersQuery,
  useAsignCoinToUserByIdMutation,
  useSearchUsersByEmailQuery,
  useGetSubAdminsQuery,
  useGetMerchantsQuery,
  useGetCountryAdminQuery,
  useGetTopPortalManagementQuery,
  useGetMidPortalManagementQuery,
  useLowerPortalManagementQuery,
  useCreateHostMutation,
  useAgencyApplyWithdrawMutation,
  useDeleteAgencyByIdMutation
} = sharedPowerApi;
