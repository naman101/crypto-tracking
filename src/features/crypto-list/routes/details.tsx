import { useParams } from 'react-router-dom';
import { useGetAssetDetailsQuery, useGetAssetHistoryQuery } from '../api';
import { skipToken } from '@reduxjs/toolkit/query';
import { ReactNode } from 'react';
import { HistoryChart } from '../components/history-chart';
import { getLocaleCurrency } from '@/utils/numbers';
import { FavouritesToggle } from '../components/favourites-toggle';
import { useCryptoPricing } from '../hooks/useCryptoPricing';
import { LoadingSpinner } from '../components/loading-spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const today = new Date();

const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

function DetailItem({ header, body }: { header: ReactNode; body: ReactNode }) {
  return (
    <div className="flex justify-between">
      <div className="font-semibold text-gray-500">{header}</div>
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
      <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-6 items-start">
        <Card className="col-span-4 lg:col-span-1 min-h-[100px]">
          {assetDetailsLoading ? (
            <div className="flex justify-center w-full">
              <LoadingSpinner />
            </div>
          ) : assetDetails ? (
            <>
              <CardHeader>
                <CardTitle className="flex gap-x-0.5 items-center">
                  {assetDetails.name}({assetDetails.symbol}){' '}
                  <FavouritesToggle assetId={assetId} />
                </CardTitle>
                <CardDescription>
                  {getLocaleCurrency(
                    prices[assetDetails.id] || assetDetails.priceUsd
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <DetailItem header="Rank" body={assetDetails.rank} />
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
              </CardContent>
            </>
          ) : null}
        </Card>
        {assetDetailsLoading ? (
          <LoadingSpinner />
        ) : assetDetails ? (
          <HistoryChart
            chartData={assetHistory}
            isLoading={assetHistoryLoading}
          />
        ) : null}
      </div>
    );
  }

  return null;
}
