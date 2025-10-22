import CompanyLayout from "@/components/layout/CompanyLayout";
import CompanyProfile from "@/pages/company/Profile";
import type { IAppRoutes } from "@/types/types";

export const companyRoutes: IAppRoutes[] = [
  {
    path: "/company",
    element: <CompanyLayout />,
    allowedRoles: ["company"],
    children: [
      { path: "profile", element: <CompanyProfile/>, allowedRoles: ["company"] },
    ],
  },
];
