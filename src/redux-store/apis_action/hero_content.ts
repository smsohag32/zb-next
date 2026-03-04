import { apiSlice } from "../slices/apiSlice";

const heroContentApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      // Get active hero slides (frontend)
      heroContent: builder.query({
         query: () => ({
            url: "/hero-content",
            method: "GET",
         }),
         providesTags: ["hero-content"],
      }),
   }),
});

export const { useHeroContentQuery } = heroContentApi;
