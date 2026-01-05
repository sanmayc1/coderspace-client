import UserLayout from '@/components/layout/UserLayout';
import CodersDetails from '@/pages/user/coders/CodersDetails';
import CodersListing from '@/pages/user/coders/CodersListing';

import UserProfile from '@/pages/user/Profile';
import type { IAppRoutes } from '@/types/types';

export const userRoutes: IAppRoutes[] = [
  {
    path: '/user',
    allowedRoles: ['user'],
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserProfile />,
        allowedRoles: ['user'],
      },
    ],
  },
  {
    path: '/',
    element: <UserLayout />,
    allowedRoles: ['user'],
    children: [
      {
        path: 'coders',
        element: <CodersListing />,
        allowedRoles: ['user'],
      },
      {
        path: 'coders/:id',
        element: <CodersDetails />,
        allowedRoles: ['user'],
      },
    ],
  },
];
