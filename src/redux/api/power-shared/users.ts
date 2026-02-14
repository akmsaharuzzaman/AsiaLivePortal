
import { TResponse } from "@/types/api";
import { onuliveCloneDashboardBaseApi } from "../base.api";
import { TUser } from "@/types/api/auth";

type TGetResponseetExactUserByShortId = TResponse<TUser>;
const becomeAgency = onuliveCloneDashboardBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getExactUserByShortId: builder.query<
            TGetResponseetExactUserByShortId,
            { shortId: string }
        >({
            query: ({ shortId }) => ({
                url: `/power-shared/users/exact-search?shortid=${shortId}`,
                method: "GET",
                // body: {shortId: shortId}
            }),
        }),

        // acceptRequest: builder.mutation<any, { userId: string }>({
        //   query: ({ userId }) => ({
        //     url: `/become-agency/request/${userId}/accept`,
        //     method: "PUT",
        //   }),
        // }),
        // rejectRequest: builder.mutation<any, { userId: string }>({
        //   query: ({ userId }) => ({
        //     url: `/become-agency/request/${userId}/reject`,
        //     method: "PUT",
        //   }),
        // }),
    }),
});

export const {
    useGetExactUserByShortIdQuery
} = becomeAgency;
