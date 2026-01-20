import CompanyLayout from '@/components/layout/CompanyLayout';
import AddContest from '@/pages/company/manage-contest/AddContest';
import EditContest from '@/pages/company/manage-contest/EditContest';
import ManageContests from '@/pages/company/manage-contest/ManageContests';
import CompanyProfile from '@/pages/company/Profile';
import type { IAppRoutes } from '@/types/types';

export const companyRoutes: IAppRoutes[] = [
  {
    path: '/company',
    element: <CompanyLayout />,
    allowedRoles: ['company'],
    children: [
      {
        path: 'profile',
        element: <CompanyProfile />,
        allowedRoles: ['company'],
      },
      {
        path: 'manage-contest',
        element: <ManageContests />,
        allowedRoles: ['company'],
      },
      {
        path: 'manage-contest/add',
        element: <AddContest />,
        allowedRoles: ['company'],
      },
      {
        path: 'manage-contest/edit/:id',
        element: <EditContest />,
        allowedRoles: ['company'],
      },
    ],
  },
];
