import { lazy } from "react";

const DeployAgentPage = lazy(
  () => import("@/pages/DeployAgentPage/DeployAgentPage")
);
const Home = lazy(() => import("@/pages/Home/Home"));

export { DeployAgentPage, Home };
