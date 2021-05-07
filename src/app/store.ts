import { configureStore } from "@reduxjs/toolkit";

import parameters, { tick } from "../features/parameters/parametersSlice";

export const store = configureStore({
  reducer: {
    parameters,
  },

  devTools: process.env.NODE_ENV !== "production",
});

// Update parameters every second
setInterval(() => store.dispatch(tick()), 1000);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
