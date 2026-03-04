import { apiSlice } from "../slices/apiSlice";

const categoryApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getCategories: builder.query({
         query: ({ page = 0, limit = 10 }) => ({
            url: `/categories`,
            method: "GET",
            params: { page, limit },
         }),
         providesTags: ["category"],
      }),
   }),
});

export const { useGetCategoriesQuery } = categoryApi;
