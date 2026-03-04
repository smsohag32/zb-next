import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useGetStoreInfoQuery } from "../apis_action/store";

export interface StoreData {
   name: string;
   email: string;
   description: string;
   phone: string;
   address: string;
   metaTitle: string;
   metaDescription: string;
   metaTags: string[];
   schema?: string;
   shipping: {
      inside_dhaka: { enabled: boolean; price: number };
      outside_dhaka: { enabled: boolean; price: number };
      isFreeShipping: boolean;
   };
   payments: {
      cashOnDelivery: { enabled: boolean };
      ssl: { enabled: boolean };
   };
   tax: {
      enabled: boolean;
      rate: number;
      label: string;
   };
   socials: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
      threads: string;
      linkedin: string;
      pinterest: string;
   };
}

interface StoreState {
   storeData: StoreData;
}

const initialState: StoreState = {
   storeData: {
      name: "",
      email: "",
      description: "",
      phone: "",
      address: "",
      metaTitle: "",
      metaDescription: "",
      metaTags: [],
      shipping: {
         inside_dhaka: { enabled: true, price: 60 },
         outside_dhaka: { enabled: true, price: 120 },
         isFreeShipping: false,
      },
      payments: {
         cashOnDelivery: { enabled: true },
         ssl: { enabled: false },
      },
      tax: {
         enabled: true,
         rate: 0,
         label: "Tax",
      },
      socials: {
         facebook: "",
         instagram: "",
         twitter: "",
         youtube: "",
         threads: "",
         linkedin: "",
         pinterest: "",
      },
   },
};

export const storeSlice = createSlice({
   name: "store",
   initialState,
   reducers: {
      setStoreData: (state, action: PayloadAction<Partial<StoreData>>) => {
         state.storeData = { ...state.storeData, ...action.payload };
      },
      resetStoreData: (state) => {
         state.storeData = initialState.storeData;
      },
   },
});

export const { setStoreData, resetStoreData } = storeSlice.actions;
export default storeSlice.reducer;
