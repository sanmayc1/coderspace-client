import CompanyLayout from "@/components/layout/CompanyLayout";
import type { IAppRoutes } from "@/types/types";



export const companyRoutes: IAppRoutes[] = [  {
    path: "/company",
    element: <CompanyLayout />,
    allowedRoles: ["company"],
    children: [],
  },]