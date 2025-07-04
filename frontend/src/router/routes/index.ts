import { lazy } from "react";

const DeployAgentPage = lazy(
  () => import("@/pages/DeployAgentPage/DeployAgentPage")
);

export { DeployAgentPage };
