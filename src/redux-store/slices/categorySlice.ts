// src/slices/categorySlice.ts

import { Category } from "@/types/category";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
   categories: Category[];
   loading: boolean;
   error: string | null;
}

const initialState: CategoryState = {
   categories: [],
   loading: false,
   error: null,
};

const categorySlice = createSlice({
   name: "category",
   initialState,
   reducers: {
      setCategories: (state, action: PayloadAction<Category[]>) => {
         state.categories = action.payload;
         state.loading = false;
         state.error = null;
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
         state.error = action.payload;
      },
   },
});

export const { setCategories, setLoading, setError } = categorySlice.actions;

export default categorySlice.reducer;
