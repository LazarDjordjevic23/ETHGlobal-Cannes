import { createBrowserRouter } from "react-router";
import { DeployAgentPage, Home } from "./routes";
import App from "@/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <DeployAgentPage />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);
