import App from "@/App";
import CustomForm from "@/components/common/reuseable/form";
import UserLayout from "@/components/layout/user-layout";
import AccessLogin from "@/pages/access-login";
import PageNotFoundError from "@/pages/error";
import Home from "@/pages/home";

import { createBrowserRouter } from "react-router-dom";

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
        ],
      },
    ],
  },
  { path: "/test", Component: CustomForm },
]);
