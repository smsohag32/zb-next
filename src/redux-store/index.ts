import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authentication from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import storeReducer from "./slices/storeSlice";
const rootReducer = {
   [apiSlice.reducerPath]: apiSlice.reducer,
   auth: authentication,
   category: categoryReducer,
   store: storeReducer,
};

export const store = configureStore({
   reducer: rootReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ["api/executeQuery/fulfilled"],
            ignoredPaths: ["api.queries"],
         },
      }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
