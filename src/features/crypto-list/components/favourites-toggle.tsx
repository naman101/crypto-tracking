import { Button } from '@/components/ui/button';
import { useFavourites } from '@/providers/crypto-favourites';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';

export function FavouritesToggle({ assetId }: { assetId: string }) {
  const { favourites, toggleFavourite } = useFavourites();
  return (
    <Button variant="ghost" onClick={() => toggleFavourite(assetId)}>
      {favourites.includes(assetId) ? (
        <HeartFilledIcon className="text-red-500" />
      ) : (
        <HeartIcon />
      )}
    </Button>
  );
}
