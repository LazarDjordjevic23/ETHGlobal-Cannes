import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { AppProviders } from "./providers/app-providers";
import { RouterProvider } from "react-router";
import { router } from "./router/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
