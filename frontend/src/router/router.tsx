import { createBrowserRouter } from "react-router";
import { DeployAgentPage, Home, Overview } from "./routes";
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
      {
        path: "/overview",
        element: <Overview />,
      },
    ],
  },
]);
