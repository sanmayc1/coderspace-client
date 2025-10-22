import UserLayout from "@/components/layout/UserLayout";
import AccessLogin from "@/pages/AccessLogin";
import AdminLogin from "@/pages/admin/Login";
import CompanyLogin from "@/pages/company/Login";
import CompanyRegister from "@/pages/company/Register";
import ForgotPassword from "@/pages/ForgetPassword";
import UserOtpVerificationPage from "@/pages/Otp";
import RestPassword from "@/pages/ResetPassword";
import Home from "@/pages/user/Home";
import UserLogin from "@/pages/user/Login";
import UserSignup from "@/pages/user/Signup";
import type { IAppRoutes } from "@/types/types";

export const guestRoutes: IAppRoutes[] = [
  {
    path: "/",
    element: <UserLayout />,
    allowedRoles: ["guest", "user"],
    children: [
      { index: true, element: <Home />, allowedRoles: ["user", "guest"] },

      // Guest-only routes grouped

      {
        path: "access-login",
        element: <AccessLogin />,
        allowedRoles: ["guest"],
      },
      {
        path: "user/signup",
        element: <UserSignup />,
        allowedRoles: ["guest"],
      },
      {
        path: "user/login",
        element: <UserLogin />,
        allowedRoles: ["guest"],
      },
      {
        path: "company/login",
        element: <CompanyLogin />,
        allowedRoles: ["guest"],
      },
      {
        path: "company/register",
        element: <CompanyRegister />,
        allowedRoles: ["guest"],
      },
      {
        path: "auth/otp-verify",
        element: <UserOtpVerificationPage />,
        allowedRoles: ["guest"],
      },
      {
        path: "auth/password/forget",
        element: <ForgotPassword />,
        allowedRoles: ["guest"],
      },
      {
        path: "auth/password",
        element: <RestPassword />,
        allowedRoles: ["guest"],
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    allowedRoles: ["guest"],
  },
];
