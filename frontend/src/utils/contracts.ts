import { contractReadPublic } from "./contract-interactions";

export const totalSupplyDaoToken = await contractReadPublic({
  contractName: "DAOToken",
  functionName: "totalSupply",
});
