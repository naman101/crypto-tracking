import { RouteObject } from 'react-router-dom';
import { List } from './list';
import { Details } from './details';

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: <List />,
  },
  {
    path: '/:assetId',
    element: <Details />,
  },
];
