import { apiSlice } from "../slices/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      createOrder: builder.mutation({
         query: (orderData: any) => ({
            url: "/order",
            method: "POST",
            body: orderData,
         }),
         invalidatesTags: ["order"],
      }),

      getUserOrders: builder.query({
         query: ({
            userId,
         }: {
            userId: string | number;
            page?: number;
            limit?: number;
            search?: string;
         }) => ({
            url: `/orders/user/${userId}`,
            method: "GET",
            params: { userId },
         }),
         providesTags: ["order"],
      }),

      // GET ORDER BY ID
      getOrderById: builder.query({
         query: (orderId: string | number) => ({
            url: `/orders/${orderId}`,
            method: "GET",
         }),
         providesTags: ["order"],
      }),
   }),
});

export const { useCreateOrderMutation, useGetUserOrdersQuery, useGetOrderByIdQuery } = orderApi;
