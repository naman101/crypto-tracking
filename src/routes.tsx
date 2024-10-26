import { createBrowserRouter } from 'react-router-dom';
import { cryptoRoutes } from './features/crypto-list';
import { Root } from './features/misc';

export const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [cryptoRoutes].flat() },
]);
