import axios from "axios";

export const loginApi = async (credentials: Record<string, any>) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/auth/login`,
         credentials
      );
      return response.data;
   } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Login failed");
   }
};
