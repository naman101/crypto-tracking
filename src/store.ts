import { configureStore } from '@reduxjs/toolkit';
import { assetsApi } from './features/crypto-list';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [assetsApi.reducerPath]: assetsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(assetsApi.middleware),
});

setupListeners(store.dispatch);
