import { lazy } from "react";

const DeployAgentPage = lazy(
  () => import("@/pages/DeployAgentPage/DeployAgentPage")
);

const Overview = lazy(() => import("@/pages/Overview/Overview"));

const Home = lazy(() => import("@/pages/Home/Home"));

const Proposal = lazy(() => import("@/pages/Proposal/Proposal"));

export { DeployAgentPage, Home, Overview, Proposal };
