import ProtectRoutes from "@/components/auth/ProtectedRoutes";
import type { IAppRoutes } from "@/types/types";
import type { RouteObject } from "react-router-dom";



export const AppRoutes = (routes: IAppRoutes[]): RouteObject[] => {
  const appRoutes = routes.map((r) => ({
    ...(r.path && { path: r.path }),
    element: (
      <ProtectRoutes element={r.element} allowedRoles={r.allowedRoles} />
    ),
    ...(r.children && { children: AppRoutes(r.children) }),
    ...(r.index && { index: r.index }),
  }));
  return appRoutes as RouteObject[];
};