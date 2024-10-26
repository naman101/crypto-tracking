import { useGetAssetsListQuery } from '../api';
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { AssetsListItem } from '../types';
import { DataTable } from '@/components/ui/data-table';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCryptoPricing } from '../hooks/useCryptoPricing';
import { useParsedSearchParams } from '@/hooks';
import { Link } from 'react-router-dom';
import { getLocaleCurrency } from '@/utils/numbers';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { FavouritesToggle } from '../components/favourites-toggle';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '../components/loading-spinner';

// Helper for defining columns in the assets table
const columnHelper = createColumnHelper<AssetsListItem>();

// Column configuration for the data table
const columns = (pricingData: Record<string, string>) => [
  // Column for favorites toggle
  columnHelper.accessor('id', {
    header: '',
    cell: ({ getValue }) => <FavouritesToggle assetId={getValue()} />,
  }),

  // Column for asset rank with sortable header
  columnHelper.accessor('rank', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Rank
        {column.getIsSorted() === 'asc' ? (
          <ChevronUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
  }),

  // Column for asset symbol with sortable header and link to asset detail
  columnHelper.accessor('symbol', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Currency
        {column.getIsSorted() === 'asc' ? (
          <ChevronUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({
      getValue,
      row: {
        original: { id },
      },
    }) => (
      <Link to={id} className="hover:underline">
        {getValue()}
      </Link>
    ),
  }),

  // Column for asset name with sortable header
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        {column.getIsSorted() === 'asc' ? (
          <ChevronUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
  }),

  // Column for asset price with currency formatting
  columnHelper.accessor('priceUsd', {
    header: 'Price',
    cell: ({ getValue, row }) => {
      const priceValue = pricingData[row.original.id] || getValue();
      return getLocaleCurrency(priceValue);
    },
  }),

  // Column for asset market cap with currency formatting
  columnHelper.accessor('marketCapUsd', {
    header: 'Market Cap',
    cell: ({ getValue }) => getLocaleCurrency(getValue()),
  }),
];

// Main component for displaying the asset list table
export function List() {
  const [{ sort, search }, setSearchParams] = useParsedSearchParams<{
    sort?: Array<`${string}.${boolean}`>;
    search?: string;
  }>();

  // Local state for sorting and column filters
  const [sorting, setSorting] = useState<SortingState>(
    sort
      ? sort.map(value => {
          const [id, desc] = value.split('.');
          return {
            id,
            desc: desc === 'true' ? true : false,
          };
        })
      : []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'name', value: search || '' },
  ]);
  const [visibleRows, setVisibleRows] = useState<Array<string>>([]);

  const { data, isLoading } = useGetAssetsListQuery(); // Fetches the assets list data
  const prices = useCryptoPricing({
    assets: visibleRows, // Updates visible assets for price lookup
  });

  // Memoize table data for efficiency
  const tableData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Initialize table instance with sorting, filtering, and pagination
  const tableInstance = useReactTable({
    data: tableData,
    columns: columns(prices),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Track visible rows for dynamic data updates
  const rows = tableInstance
    .getRowModel()
    .rows.map(row => row.original.id)
    .join(',');

  // Update visible rows on change
  useEffect(() => {
    setVisibleRows(rows.split(','));
  }, [rows]);

  // Update search and sorting params in URL when state changes
  useEffect(() => {
    setSearchParams({
      sort: sorting.map(
        (state): `${string}.${boolean}` => `${state.id}.${state.desc}`
      ),
      search: (columnFilters?.[0]?.value || undefined) as string | undefined,
    });
  }, [sorting, setSearchParams, columnFilters]);

  // Render the table and search input
  return (
    <div className="w-full mx-auto lg:w-3/4 xl:w-3/5 space-y-4">
      <h1 className="font-bold text-3xl">Crypto Currency Tracker</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search assets..."
              value={
                (tableInstance.getColumn('name')?.getFilterValue() as string) ??
                ''
              }
              onChange={event =>
                tableInstance
                  .getColumn('name')
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <DataTable tableInstance={tableInstance} />
        </>
      )}
    </div>
  );
}
