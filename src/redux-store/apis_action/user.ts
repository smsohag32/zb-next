import { apiSlice } from "../slices/apiSlice";

const userApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      updateProfile: builder.mutation({
         query: ({ id, ...userData }) => ({
            url: `/user/update-profile/${id}`,
            method: "PUT",
            body: { ...userData },
         }),
         invalidatesTags: ["users"],
      }),
      updateProfileImage: builder.mutation({
         query: ({ id, formData }) => ({
            url: `/user/update-profile-image/${id}`,
            method: "PUT",
            body: formData,
         }),
         invalidatesTags: ["users"],
      }),
      deleteUser: builder.mutation({
         query: (userId) => ({
            url: `/user-control/users/${userId}`,
            method: "DELETE",
         }),
         invalidatesTags: ["users"],
      }),
      getUsers: builder.query({
         query: ({ status = "all", limit = 10, query, page = 1 }) => ({
            url: `/users`,
            method: "GET",
            params: { status, query, limit, page },
         }),
         providesTags: ["users"],
      }),
      getUserAddress: builder.query({
         query: (userId) => ({
            url: `/user/auth/address/${userId}`,
            method: "GET",
         }),
         providesTags: ["users"],
      }),
      getUserStats: builder.query({
         query: (userId) => ({
            url: `/user/stats/${userId}`,
            method: "GET",
         }),
         providesTags: ["users"],
      }),

      changeUserStatus: builder.mutation({
         query: ({ userId, status }) => ({
            url: `/user-control/users/status-change/${userId}`,
            method: "PATCH",
            body: { status },
         }),
         invalidatesTags: ["users"],
      }),

      changePassword: builder.mutation({
         query: (data) => ({
            url: `/user-control/users/change-password`,
            method: "PUT",
            body: data,
         }),
         invalidatesTags: ["users"],
      }),
      forgotPassword: builder.mutation({
         query: (data) => ({
            url: `/user/auth/forgot-password`,
            method: "POST",
            body: data,
         }),
      }),
      verifyOTP: builder.mutation({
         query: (data) => ({
            url: `/user/auth/verify-otp`,
            method: "POST",
            body: data,
         }),
      }),
      resetPassword: builder.mutation({
         query: (data) => ({
            url: `/user/auth/reset-password`,
            method: "POST",
            body: data,
         }),
      }),
   }),
});

export const {
   useGetUserAddressQuery,
   useGetUserStatsQuery,
   useUpdateProfileImageMutation,
   useUpdateProfileMutation,
   useDeleteUserMutation,
   useGetUsersQuery,
   useChangePasswordMutation,
   useChangeUserStatusMutation,
   useForgotPasswordMutation,
   useVerifyOTPMutation,
   useResetPasswordMutation,
} = userApi;
