import AdminLayout from "@/components/layout/AdminLayout";
import UserManagement from "@/pages/admin/manage-users/ManageUser";
import type { IAppRoutes } from "@/types/types";
import Table from "@/components/common/Table";
import ProblemManagement from "@/pages/admin/manage-problems/ManageProblems";
import AddProblem from "@/pages/admin/manage-problems/AddProblem";
import AddLanguage from "@/pages/admin/manage-problems/AddLanguage";
import AddTestcase from "@/pages/admin/manage-problems/AddTestcase";

export const adminRoutes: IAppRoutes[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    allowedRoles: ["admin"],
    children: [
      {
        index: true,
        element: <h1>dash</h1>,
        allowedRoles: ["admin"],
      },
      {
        path: "manage-user",
        element: <UserManagement />,
        allowedRoles: ["admin"],
      },
      {
        path: "manage-business",
        element: (
          <Table
            columns={[{ key: "hell", label: "sdf" }]}
            data={[{ hell: "dfsdf" }]}
            className=""
          />
        ),
        allowedRoles: ["admin"],
      },
      {
        path: "manage-problems",
        element: <ProblemManagement />,
        allowedRoles: ["admin"],
      },
      {
        path: "manage-problems/add",
        element: <AddProblem />,
        allowedRoles: ["admin"],
      },
      {
        path:"/admin/manage-problems/language/:id",
        element:<AddLanguage/>,
        allowedRoles:["admin"]
      },
            {
        path:"/admin/manage-problems/testcase/:id",
        element:<AddTestcase/>,
        allowedRoles:["admin"]
      },

    ],
  },
];
