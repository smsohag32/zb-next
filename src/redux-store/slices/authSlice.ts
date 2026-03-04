import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCookie, getCookie, setCookie } from "@/helpers/cookie";
import { loginApi } from "../apis_action/login";

const getPersistedToken = getCookie("cus_p_access_token");
const cookieValue = getCookie("cus_p_user_info") || "";
const getPersistedUser = cookieValue ? JSON.parse(cookieValue) : null;
const initialState: any = {
   token: getPersistedToken,
   user: getPersistedUser,
   isLoading: false,
   error: null,
};

export const loginUser = createAsyncThunk<any, any>(
   "auth/loginUser",
   async (credentials, { rejectWithValue }: any) => {
      try {
         const response = await loginApi(credentials);
         return response;
      } catch (error: any) {
         return rejectWithValue(error?.message || "Login failed");
      }
   }
);

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logoutUser: (state) => {
         state.token = null;
         state.user = null;
         deleteCookie("cus_p_access_token");
         deleteCookie("refresh_token");
         deleteCookie("cus_p_user_info");
      },
      setUpdatedUserInfo: (state, action) => {
         state.user = { ...state.user, ...action.payload };
         setCookie("cus_p_access_token", JSON.stringify(state.user));
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            const { token, user } = action.payload.data;
            console.log(token);
            state.token = token;
            state.user = user;

            if (state.token) {
               setCookie("cus_p_access_token", state.token);
            }

            if (state.user) {
               setCookie("cus_p_user_info", JSON.stringify(state.user));
            }
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Login failed";
         });
   },
});

export const { logoutUser, setUpdatedUserInfo } = authSlice.actions;
export default authSlice.reducer;
