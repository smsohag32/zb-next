import { apiSlice } from "../slices/apiSlice";

const storeApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      // ✅ Get Store Info
      getStoreInfo: builder.query({
         query: () => ({
            url: "/store",
            method: "GET",
         }),
         providesTags: ["store"],
      }),

    
   }),
});

export const { useGetStoreInfoQuery } = storeApi;
