import UserLayout from '@/components/layout/UserLayout';
import ChatListing from '@/pages/user/chat/ChatListing';
import CodersDetails from '@/pages/user/coders/CodersDetails';
import CodersListing from '@/pages/user/coders/CodersListing';
import ContestDetails from '@/pages/user/contests/ContestDetailsPage';
import ContestLeaderBoardPage from '@/pages/user/contests/ContestLeaderBoardPage';
import Interview from '@/pages/user/interview/Interview';
import UserProfile from '@/pages/user/Profile';
import UpgradePlan from '@/pages/user/UpgradePlan';
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
      {
        path: 'upgrade',
        element: <UpgradePlan />,
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
      {
        path: 'contest/:id',
        element: <ContestDetails />,
        allowedRoles: ['user'],
      },
      {
        path: 'contest/:id/leaderboard',
        element: <ContestLeaderBoardPage />,
        allowedRoles: ['user'],
      },
      {
        path: 'chat',
        element: <ChatListing />,
        allowedRoles: ['user'],
      },
    ],
  },
  {
    path: 'interview/:id',
    element: <Interview />,
    allowedRoles: ['user'],
  },
];
