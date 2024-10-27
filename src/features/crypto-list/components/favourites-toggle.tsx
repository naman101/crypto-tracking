import { Button } from '@/components/ui/button';
import { useFavourites } from '@/providers/crypto-favourites';
import { Heart } from 'lucide-react';

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
        <Heart fill="#f87171" className="text-red-600" />
      ) : (
        <Heart />
      )}
    </Button>
  );
}
