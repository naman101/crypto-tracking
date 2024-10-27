import { Button } from '@/components/ui/button';
import { useFavourites } from '@/providers/crypto-favourites';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';

export function FavouritesToggle({ assetId }: { assetId: string }) {
  const { favourites, toggleFavourite } = useFavourites();
  const isIncluded = favourites.includes(assetId);

  return (
    <Button
      variant="ghost"
      onClick={() => toggleFavourite(assetId)}
      aria-checked={isIncluded}
    >
      {isIncluded ? (
        <HeartFilledIcon className="text-red-500" />
      ) : (
        <HeartIcon />
      )}
    </Button>
  );
}
