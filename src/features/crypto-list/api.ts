import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AssetHistory, type AssetsListItem } from './types';

// Define an API service for managing asset data using RTK Query
export const assetsApi = createApi({
  reducerPath: 'assetsApi', // Unique key for API state
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coincap.io/v2/' }), // API base URL
  endpoints: builder => ({
    // Endpoint to fetch a list of assets
    getAssetsList: builder.query<Array<AssetsListItem>, void>({
      query: () => 'assets?offset=0&limit=100',
      transformResponse: (response: { data: Array<AssetsListItem> }) =>
        response.data, // Extract the asset list from the response
    }),

    // Endpoint to fetch real-time prices via WebSocket
    getPrices: builder.query<Record<string, string>, Array<string>>({
      queryFn: () => ({ data: {} }), // Initial empty data
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Open a WebSocket connection for live price updates
        const ws = new WebSocket(
          `wss://ws.coincap.io/prices?assets=${arg.join(',')}`
        );
        try {
          await cacheDataLoaded;

          // Listen for incoming WebSocket messages and update the cache
          const listener = (event: MessageEvent) => {
            if (event.data) {
              const data = JSON.parse(event.data);
              updateCachedData(draft => ({ ...draft, ...data }));
            }
          };
          ws.addEventListener('message', listener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        await cacheEntryRemoved; // Close WebSocket when cache is removed
        ws.close();
      },
    }),

    // Endpoint to fetch details of a specific asset by its ID
    getAssetDetails: builder.query<AssetsListItem, string>({
      query: assetId => `assets/${assetId}`,
      transformResponse: (response: { data: AssetsListItem }) => response.data,
    }),

    // Endpoint to fetch historical data for a specific asset
    getAssetHistory: builder.query<
      Array<AssetHistory>,
      { assetId: string; start: number; end: number }
    >({
      query: ({ assetId, ...args }) => ({
        url: `assets/${assetId}/history`,
        params: {
          interval: 'd1', // Daily interval for historical data
          ...args,
        },
      }),
      transformResponse: (response: { data: Array<AssetHistory> }) =>
        response.data,
    }),
  }),
});

// Export hooks for each endpoint to be used in components
export const {
  useGetAssetsListQuery,
  useGetPricesQuery,
  useGetAssetDetailsQuery,
  useGetAssetHistoryQuery,
} = assetsApi;
