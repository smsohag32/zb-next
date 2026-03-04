import { apiSlice } from "../slices/apiSlice";

const productApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getAllProducts: builder.query({
         query: ({
            page = 0,
            limit = 10,
            search,
            category,
            featured,
            minPrice,
            maxPrice,
            brands,
            sizes,
            inStockOnly,
            sort,
         }) => ({
            url: `/products/public`,
            method: "GET",
            params: {
               page,
               limit,
               search,
               category,
               minPrice,
               maxPrice,
               brands,
               sizes,
               featured,
               inStockOnly,
               sort,
            },
         }),
         providesTags: ["product"],
      }),

      getProductById: builder.query({
         query: (id: string | number) => ({
            url: `/product/${id}`,
            method: "GET",
         }),
         providesTags: ["product"],
      }),
      getProductBySlug: builder.query({
         query: (slug: string | number) => ({
            url: `/product/by-slug/${slug}`,
            method: "GET",
         }),
         providesTags: ["product"],
      }),
      getRelatedProducts: builder.query({
         query: (id: string | number) => ({
            url: `/products/${id}/related`,
            method: "GET",
         }),
         providesTags: ["product"],
      }),
   }),
});

export const {
   useGetAllProductsQuery,
   useGetProductByIdQuery,
   useGetRelatedProductsQuery,
   useGetProductBySlugQuery,
} = productApi;
