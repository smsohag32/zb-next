import { apiSlice } from "../slices/apiSlice";

export const locationApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      detectLocation: builder.mutation({
         query: (address: string) => ({
            url: "/location/detect",
            method: "POST",
            body: { address },
         }),
      }),
   }),
});

export const { useDetectLocationMutation } = locationApi;
