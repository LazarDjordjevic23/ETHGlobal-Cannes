import { lazy } from "react";

const DeployAgentPage = lazy(
  () => import("@/pages/DeployAgentPage/DeployAgentPage")
);

const OverviewPage = lazy(() => import("@/pages/OverviewPage/OverviewPage"));

const Home = lazy(() => import("@/pages/Home/Home"));

const GovernancePage = lazy(
  () => import("@/pages/GovernancePage/GovernancePage")
);

const ProposalDetail = lazy(
  () => import("@/pages/ProposalDetail/ProposalDetail")
);

export { DeployAgentPage, Home, OverviewPage, GovernancePage, ProposalDetail };
