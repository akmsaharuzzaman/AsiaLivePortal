import { TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "../base.api";
import { tagTypes } from "../../tag.types";
import { TBlockUserResult } from "@/types/api/user";


type TGetBlockedUsers = TResponse<TBlockUserResult[]>;
type TBlockUserByIdResponse = TResponse<TBlockUserResult>;

const blockedEmails = onuliveCloneDashboardBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    blockUserByEmail: builder.mutation<TBlockUserByIdResponse, { email: string }>({
      query: (userInfo) => ({
        url: "/blocked-emails",
        method: "POST",
        body: { email: userInfo.email },
      }),
      invalidatesTags: [tagTypes.blockUser],
    }),
    getBlockedUsers: builder.query<TGetBlockedUsers, void>({
      query: () => ({
        url: "/blocked-emails",
        method: "GET",
      }),
      providesTags: [tagTypes.blockUser],
    }),
    deleteBlockedEmail: builder.mutation<TBlockUserByIdResponse, { _id: string }>({
      query: (userInfo) => ({
        url: `/blocked-emails/${userInfo._id}`,
        method: "DELETE",
        body: { _id: userInfo._id },
      }),
      invalidatesTags: [tagTypes.blockUser],
    }),
    
  }),
});

export const { useBlockUserByEmailMutation, useGetBlockedUsersQuery, useDeleteBlockedEmailMutation } =
  blockedEmails;
