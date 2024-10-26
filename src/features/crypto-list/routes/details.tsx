import { useParams } from 'react-router-dom';
import { useGetAssetDetailsQuery, useGetAssetHistoryQuery } from '../api';
import { skipToken } from '@reduxjs/toolkit/query';
import { ReactNode } from 'react';
import { HistoryChart } from '../components/history-chart';
import { getLocaleCurrency } from '@/utils/numbers';
import { FavouritesToggle } from '../components/favourites-toggle';
import { useCryptoPricing } from '../hooks/useCryptoPricing';
import { LoadingSpinner } from '../components/loading-spinner';

const today = new Date();

const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

function DetailItem({ header, body }: { header: ReactNode; body: ReactNode }) {
  return (
    <div className="space-y-1 col-span-1">
      <div className="font-semibold">{header}</div>
      <div className="font-medium">{body}</div>
    </div>
  );
}

export function Details() {
  const { assetId } = useParams();

  const { data: assetDetails, isLoading: assetDetailsLoading } =
    useGetAssetDetailsQuery(assetId || skipToken);
  const { data: assetHistory, isLoading: assetHistoryLoading } =
    useGetAssetHistoryQuery(
      assetId
        ? { assetId, start: thirtyDaysAgo.getTime(), end: today.getTime() }
        : skipToken
    );
  const prices = useCryptoPricing({ assets: assetId ? [assetId] : null });

  if (assetId) {
    return (
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        <h1 className="flex gap-x-0.5 items-center">
          <span className="text-3xl font-bold underline ">
            {assetDetails?.name || assetId}
          </span>
          <FavouritesToggle assetId={assetId} />
        </h1>
        {assetDetailsLoading ? (
          <LoadingSpinner />
        ) : assetDetails ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border shadow-md rounded-sm py-3 px-2 text-sm">
              <DetailItem header="Rank" body={assetDetails.rank} />
              <DetailItem
                header="Currency"
                body={
                  <>
                    {assetDetails.name}({assetDetails.symbol})
                  </>
                }
              />
              <DetailItem
                header="Price"
                body={getLocaleCurrency(
                  prices[assetDetails.id] || assetDetails.priceUsd
                )}
              />
              <DetailItem
                header="Supply"
                body={parseFloat(assetDetails.supply).toFixed(2)}
              />
              <DetailItem
                header="Market Cap"
                body={getLocaleCurrency(assetDetails.marketCapUsd)}
              />
              <DetailItem
                header="Volume Used(24 Hrs)"
                body={parseFloat(assetDetails.volumeUsd24Hr).toFixed(4)}
              />
            </div>
            <HistoryChart
              chartData={assetHistory}
              isLoading={assetHistoryLoading}
            />
          </>
        ) : null}
      </div>
    );
  }

  return null;
}
