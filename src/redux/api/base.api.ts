import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { tagTypesList } from "../tag.types";
import { logOut } from "../features/auth.slice";
import { persistStor } from "../store"; // Make sure you export persistor from your store

const asiaLiveBaseURL = "http://69.62.74.36:8000/api" // production mode
const rawBaseQuery = fetchBaseQuery({
  baseUrl: asiaLiveBaseURL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

// Custom baseQuery to handle 401
const baseQueryWith401Handler: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logOut());
    persistStor.purge();
    // Redirect to login page
  }

  return result;
};

export const onuliveCloneDashboardBaseApi = createApi({
  reducerPath: "onuliveCloneDashboardApi",
  baseQuery: baseQueryWith401Handler,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
