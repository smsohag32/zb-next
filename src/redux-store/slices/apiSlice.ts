import { getCookie } from "@/helpers/cookie";
import {
   createApi,
   fetchBaseQuery,
   type BaseQueryFn,
   type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "./authSlice";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`;

const baseQuery = fetchBaseQuery({
   baseUrl: API_BASE_URL,
   prepareHeaders: (headers) => {
      const accessToken = getCookie("cus_p_access_token");
      if (accessToken) {
         headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
   },
});

const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
   args,
   api,
   extraOptions
) => {
   const result = await baseQuery(args, api, extraOptions);
   if (result?.error?.status === 401) {
      api.dispatch(logoutUser());
      if (typeof window !== "undefined") {
         window.location.href = "/";
      }
   }

   return result;
};

export const apiSlice = createApi({
   reducerPath: "api",
   baseQuery: baseQueryWithAuth,
   tagTypes: ["roles", "users", "category", "product", "order", "store", "hero-content", "Reviews", "section"],
   endpoints: () => ({}),
});
