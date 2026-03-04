import { apiSlice } from "../slices/apiSlice";

const rolesApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      // Roles CRUD
      createRole: builder.mutation({
         query: (roleData) => ({
            url: `/roles`,
            method: "POST",
            body: roleData,
         }),
         invalidatesTags: ["roles"],
      }),
      editRole: builder.mutation({
         query: ({ roleId, ...roleData }) => ({
            url: `/roles`,
            method: "PUT",
            body: {id:roleId, ...roleData},
         }),
         invalidatesTags: ["roles"],
      }),
      deleteRole: builder.mutation({
         query: (roleId) => ({
            url: `/roles/${roleId}`,
            method: "DELETE",
         }),
         invalidatesTags: ["roles"],
      }),
      getRoles: builder.query({
         query: () => ({
            url: `/roles`,
            method: "GET",
         }),
         providesTags: ["roles"],
      }),

      // Role status change
      changeRoleStatus: builder.mutation({
         query: ({ roleId, status }) => ({
            url: `/roles/${roleId}/status`,
            method: "PATCH",
            body: { status },
         }),
         invalidatesTags: ["roles"],
      }),

      // Permissions
      getAllPermissions: builder.query({
         query: () => ({
            url: `/permission`,
            method: "GET",
         }),
         providesTags: ["roles"],
      }),
      
   }),
});

export const {
   useCreateRoleMutation,
   useEditRoleMutation,
   useDeleteRoleMutation,
   useGetRolesQuery,
   useChangeRoleStatusMutation,
   useGetAllPermissionsQuery,
} = rolesApi;
