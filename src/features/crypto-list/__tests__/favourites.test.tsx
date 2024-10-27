import { render, screen, userEvent } from '@/testing/test-utils';
import { FavouritesToggle } from '../components/favourites-toggle';

describe('Favorites Toggle', () => {
  it('shows correct initial favorite state', async () => {
    render(<FavouritesToggle assetId="bitcoin" />);

    const favoriteButton = screen.getByRole('button');
    await userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('aria-checked', 'false');
  });
});
