import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './providers/store';
import { router } from './routes';
import { FavouritesProvider } from './providers/crypto-favourites';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <FavouritesProvider>
        <RouterProvider router={router} />
      </FavouritesProvider>
    </Provider>
  </StrictMode>
);
