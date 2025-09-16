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
import UserOtpVerificationPage from "@/pages/otp";
import ForgotPassword from "@/pages/forgot-password";
import RestPassword from "@/pages/reset-password";
import AdminLayout from "@/components/layout/admin-layout";
import SimpleTable from "@/components/common/table";
import UserMangement from "@/pages/admin/user-management";
import GuestOnly from "@/components/auth/guest-only";
import UserOnly from "@/components/auth/user-only";
import AuthRequired from "@/components/auth/authRequired";
import CompanyLayout from "@/components/layout/company-layout";
import UserProfile from "@/pages/user/user-profile";

export const routers = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: PageNotFoundError,
    children: [
      {
        Component: UserLayout,

        children: [
          {
            Component: GuestOnly,
            children: [
              { path: "/access-login", Component: AccessLogin },
              { path: "/user/signup", Component: UserSignup },
              { path: "/user/login", Component: UserLogin },
              { path: "/company/login", Component: CompanyLogin },
              { path: "/company/register", Component: CompanyRegister },
              { path: "/auth/otp-verify", Component: UserOtpVerificationPage },
              { path: "/auth/password/forget", Component: ForgotPassword },
              { path: "/auth/password", Component: RestPassword },
            ],
          },

          {
            Component: UserOnly,
            children: [{ index: true, Component: Home }],
          },
        ],
      },

      // User Protected

      {
        path: "/user",
        element: (
          <AuthRequired role="user">
            <UserLayout />
          </AuthRequired>
        ),
        children: [
          // Profile Page
          {
            index: true,
            Component: UserProfile,
          },
        ],
      },

      // Admin Protected
      {
        path: "/admin",
        element: (
          <AuthRequired role="admin">
            <AdminLayout />
          </AuthRequired>
        ),
        children: [
          {
            path: "/admin",
            element: <h1>dash</h1>,
          },
          {
            path: "/admin/manage-user",
            Component: UserMangement,
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
      {
        path: "/company",
        element: (
          <AuthRequired role="company">
            <CompanyLayout />
          </AuthRequired>
        ),
        children: [],
      },
    ],
  },

  {
    path: "/test",
  },
]);
