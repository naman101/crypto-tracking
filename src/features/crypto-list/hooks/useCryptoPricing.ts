import { skipToken } from '@reduxjs/toolkit/query';
import { useGetPricesQuery } from '../api';

export function useCryptoPricing({ assets }: { assets: Array<string> | null }) {
  const { data } = useGetPricesQuery(assets?.length ? assets : skipToken);

  return data || {};
}
