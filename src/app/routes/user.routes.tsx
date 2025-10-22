import UserLayout from "@/components/layout/UserLayout";
import UserProfile from "@/pages/user/Profile";
import type { IAppRoutes } from "@/types/types";


export const userRoutes:IAppRoutes[] =   [{
    path: "/user",
    allowedRoles: ["user"],
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserProfile />,
        allowedRoles: ["user"],
      },
    ],
  }]