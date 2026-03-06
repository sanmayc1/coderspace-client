import AdminLayout from '@/components/layout/AdminLayout';
import UserManagement from '@/pages/admin/manage-users/ManageUser';
import type { IAppRoutes } from '@/types/types';
import ProblemManagement from '@/pages/admin/manage-problems/ManageProblems';
import AddProblem from '@/pages/admin/manage-problems/AddProblem';
import AddLanguage from '@/pages/admin/manage-problems/AddLanguage';
import AddTestcase from '@/pages/admin/manage-problems/AddTestcase';
import ManageSkillsAndDomains from '@/pages/admin/manage-skills-and-domains/ManageSkillsAndDomains';
import EditProblem from '@/pages/admin/manage-problems/EditProblem';
import ListAllPlans from '@/pages/admin/manage-payments/ListAllPlans';
import ListAllPayments from '@/pages/admin/manage-payments/ListAllPayments';
import ListAllInterviews from '@/pages/admin/manage-interviews/ListAllInterviews';
import Dashboard from '@/pages/admin/Dashboard';
import Settings from '@/pages/admin/Settings';

export const adminRoutes: IAppRoutes[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    allowedRoles: ['admin'],
    children: [
      {
        index: true,
        element: <h1>dash</h1>,
        allowedRoles: ['admin'],
      },
      {
        path: 'manage-user',
        element: <UserManagement />,
        allowedRoles: ['admin'],
      },
      {
        path: 'manage-problems',
        element: <ProblemManagement />,
        allowedRoles: ['admin'],
      },
      {
        path: 'manage-problems/add',
        element: <AddProblem />,
        allowedRoles: ['admin'],
      },
      {
        path: '/admin/manage-problems/language/:id',
        element: <AddLanguage />,
        allowedRoles: ['admin'],
      },
      {
        path: '/admin/manage-problems/testcase/:id',
        element: <AddTestcase />,
        allowedRoles: ['admin'],
      },
      {
        path: '/admin/manage-problems/:id/edit',
        element: <EditProblem />,
        allowedRoles: ['admin'],
      },
      {
        path: 'manage-skills-and-domains',
        element: <ManageSkillsAndDomains />,
        allowedRoles: ['admin'],
      },
      {
        path: 'manage-plans',
        element: <ListAllPlans />,
        allowedRoles: ['admin'],
      },
      {
        path:"manage-payments",
        element: <ListAllPayments />,
        allowedRoles: ['admin'],
      },
      {
        path:"manage-interviews",
        element: <ListAllInterviews />,
        allowedRoles: ['admin'],
      },
      {
        path:"dashboard",
        element: <Dashboard />,
        allowedRoles: ['admin'],
      }
      ,
      {
        path:"settings",
        element:<Settings/>,
        allowedRoles:['admin']
      }
    ],
  },
];
