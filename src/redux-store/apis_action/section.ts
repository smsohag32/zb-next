import { apiSlice } from "../slices/apiSlice";

export const sectionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET PUBLIC SECTIONS
        getPublicSections: builder.query({
            query: () => ({
                url: "/sections/public",
                method: "GET",
            }),
            providesTags: ["section"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetPublicSectionsQuery } = sectionApi;
