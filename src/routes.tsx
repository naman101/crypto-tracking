import { createBrowserRouter } from 'react-router-dom';
import { cryptoRoutes } from './features/crypto-list';

export const router = createBrowserRouter([cryptoRoutes].flat());
