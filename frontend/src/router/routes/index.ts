import { lazy } from "react";

const DeployAgentPage = lazy(
  () => import("@/pages/DeployAgentPage/DeployAgentPage")
);

const OverviewPage = lazy(() => import("@/pages/OverviewPage/OverviewPage"));

const GovernancePage = lazy(
  () => import("@/pages/GovernancePage/GovernancePage")
);

const ProposalDetail = lazy(
  () => import("@/pages/ProposalDetail/ProposalDetail")
);

const AgentPage = lazy(() => import("@/pages/AgentPage/AgentPage"));

export {
  DeployAgentPage,
  OverviewPage,
  GovernancePage,
  ProposalDetail,
  AgentPage,
};
