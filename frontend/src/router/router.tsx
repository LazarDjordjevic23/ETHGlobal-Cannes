import { createBrowserRouter } from "react-router";
import {
  DeployAgentPage,
  OverviewPage,
  GovernancePage,
  ProposalDetail,
  AgentPage,
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
      {
        path: "/agents",
        element: <AgentPage />,
      },
    ],
  },
]);
