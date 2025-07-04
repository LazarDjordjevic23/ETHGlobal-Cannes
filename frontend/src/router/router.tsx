import { createBrowserRouter } from "react-router";
import {
  DeployAgentPage,
  Home,
  OverviewPage,
  GovernancePage,
  ProposalDetail,
} from "./routes";
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
        element: <OverviewPage />,
      },
      {
        path: "/proposal",
        element: <GovernancePage />,
      },
      {
        path: "/proposal/:proposalId",
        element: <ProposalDetail />,
      },
    ],
  },
]);
