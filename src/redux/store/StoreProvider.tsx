'use client'
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { reducers } from "@/redux/reducers";
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

type Props = {
  children: React.ReactNode;
};

const StoreProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default StoreProvider;
