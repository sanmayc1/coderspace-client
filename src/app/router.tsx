import App from "@/App";
import UserLayout from "@/components/layout/user-layout";
import CompanyLogin from "@/pages/company/company-login";
import AccessLogin from "@/pages/access-login";
import PageNotFoundError from "@/pages/error";
import Home from "@/pages/user/home";
import UserLogin from "@/pages/user/user-login";
import UserSignup from "@/pages/user/user-signup";
import { createBrowserRouter } from "react-router-dom";
import CompanyRegister from "@/pages/company/company-register";
import UserOtpVerificationPage from "@/pages/user/otp";
import ForgotPassword from "@/pages/user/forgot-password";
import RestPassword from "@/pages/user/reset-password";
import AdminLayout from "@/components/layout/admin-layout";
import SimpleTable from "@/components/common/table";
import UserMangement from "@/pages/admin/user-management";

export const routers = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: PageNotFoundError,
    children: [
      {
        Component: UserLayout,
        children: [
          { index: true, Component: Home },
          { path: "/access-login", Component: AccessLogin },
          { path: "/user/signup", Component: UserSignup },
          { path: "/user/login", Component: UserLogin },
          { path: "/company/login", Component: CompanyLogin },
          { path: "/company/register", Component: CompanyRegister },
          { path: "/user/otp-verify", Component: UserOtpVerificationPage },
          { path: "/user/password", Component: ForgotPassword },
          { path: "auth/password", Component: RestPassword },
        ],
      },
      {
        path: "/admin",
        Component: AdminLayout,
        children: [
          {
            path: "/admin",
            element: <h1>dash</h1>,
          },
          {
            path: "/admin/manage-user",
            Component: UserMangement
          },
          {
            path: "/admin/manage-business",
            element: (
              <SimpleTable
                columns={[{ key: "hell", label: "sdf" }]}
                data={[{ hell: "dfsdf" }]}
                className=""
              />
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/test",
  },
]);
