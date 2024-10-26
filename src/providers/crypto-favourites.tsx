import { createContext, ReactNode, useContext, useState } from 'react';

// Define the structure for the provider's state, including the list of favourites and a toggle function
type FavouritesProviderState = {
  favourites: Array<string>;
  toggleFavourite: (assetId: string) => void;
};

// Key for storing favourites in localStorage
const FAVOURITES_KEY = 'crypto-favourites';

// Retrieve stored favourites from localStorage if available
const storedFavourites = localStorage.getItem(FAVOURITES_KEY);

// Initial state for the context, defaults to an empty list and a no-op toggle function
const initialState: FavouritesProviderState = {
  favourites: [],
  toggleFavourite: () => null,
};

// Create the context with the initial state
const FavouritesProviderContext =
  createContext<FavouritesProviderState>(initialState);

// Context provider component to manage and provide favourites data
export function FavouritesProvider({ children }: { children: ReactNode }) {
  // Initialize favourites state from localStorage or with an empty array
  const [favourites, setFavourites] = useState<Array<string>>(
    storedFavourites ? JSON.parse(storedFavourites) : []
  );

  // Function to toggle a favourite item on or off
  const onToggleFavourite = (asset: string) => {
    setFavourites(prev => {
      let favouritesCopy = [...prev];

      // If asset is already a favourite, remove it; otherwise, add it
      if (favouritesCopy.includes(asset)) {
        favouritesCopy = favouritesCopy.filter(value => value !== asset);
      } else {
        favouritesCopy.push(asset);
      }

      // Update localStorage to persist favourites
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favouritesCopy));

      return favouritesCopy;
    });
  };

  // Provide the favourites list and toggle function to child components
  return (
    <FavouritesProviderContext.Provider
      value={{ favourites, toggleFavourite: onToggleFavourite }}
    >
      {children}
    </FavouritesProviderContext.Provider>
  );
}

// Custom hook to access the favourites context
export const useFavourites = () => {
  const context = useContext(FavouritesProviderContext);

  // Ensure the hook is used within the correct context provider
  if (context === undefined)
    throw new Error('useFavourites must be used within a FavouritesProvider');

  return context;
};
