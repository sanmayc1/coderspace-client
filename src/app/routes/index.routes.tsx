import { userRoutes } from "./user.routes";
import { guestRoutes } from "./guest.routes";
import { adminRoutes } from "./admin.routes";
import { companyRoutes } from "./company.routes";
import { AppRoutes } from "@/utils/router-helper";
import type { IAppRoutes } from "@/types/types";
import PageNotFoundError from "@/pages/Error";
import { createBrowserRouter } from "react-router-dom";

const appRoutes: IAppRoutes[] = [
 ...userRoutes ,
 ...guestRoutes, 
 ...adminRoutes,
 ...companyRoutes,
  {
    path: "*",
    element: <PageNotFoundError />,
    allowedRoles: ["admin", "company", "guest", "user"],
  },
];


export const routers = createBrowserRouter(AppRoutes(appRoutes));
