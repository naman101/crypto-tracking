import React, { ReactElement } from 'react';
import {
  render,
  RenderOptions,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { FavouritesProvider } from '@/providers/crypto-favourites';
import { Provider } from 'react-redux';
import { store } from '@/providers/store';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

export const waitForLoadingToFinish = async () => {
  // First check if any loading elements exist
  const loadingElements = [
    ...screen.queryAllByTestId(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ];

  try {
    // Only wait for removal if there are loading elements
    if (loadingElements.length > 0) {
      await waitForElementToBeRemoved(
        () => [
          ...screen.queryAllByTestId(/loading/i),
          ...screen.queryAllByText(/loading/i),
        ],
        { timeout: 4000 }
      );
    }
  } catch (error) {
    // Handle timeout or other errors
    console.error('Error waiting for loading to finish:', error);
    throw error;
  }
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <FavouritesProvider>{children}</FavouritesProvider>
    </Provider>
  );
};

const customRender = async (
  ui: ReactElement,
  {
    url,
    path,
    ...renderOptions
  }: Omit<RenderOptions, 'wrapper'> & { url: string; path: string } = {
    url: '/',
    path: '/',
  }
) => {
  const router = createMemoryRouter(
    [
      {
        path: path,
        element: ui,
      },
    ],
    {
      initialEntries: url ? ['/', url] : ['/'],
      initialIndex: url ? 1 : 0,
    }
  );

  const returnValue = {
    ...render(ui, {
      wrapper: () => {
        return (
          <AllTheProviders>
            <RouterProvider router={router} />
          </AllTheProviders>
        );
      },
      ...renderOptions,
    }),
  };

  await waitForLoadingToFinish();

  return returnValue;
};

export * from '@testing-library/react';
export { customRender as render, userEvent };
