import { apiSlice } from "../slices/apiSlice";

const reviewApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: (productId) => ({
                url: `/reviews/${productId}`,
            }),
            providesTags: ["Reviews"],
        }),
        addReview: builder.mutation({
            query: (body) => ({
                url: "/reviews",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Reviews", "product"],
        }),
    }),
});

export const { useGetProductReviewsQuery, useAddReviewMutation } = reviewApi;
