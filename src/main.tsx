import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, RouterProvider } from "react-router";
import { routers } from "./app/router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <RouterProvider router={routers} />
  </StrictMode>
);
