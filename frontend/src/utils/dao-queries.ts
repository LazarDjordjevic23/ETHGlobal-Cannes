import {
  contractReadPublic,
  getContractAddress,
  type AvailableContractName,
} from "./contract-interactions";
import { wait } from "./time";
import { divideOnWei } from "./web3";

export const totalSupplyDaoToken = async (): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "DAOToken",
      functionName: "totalSupply",
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching DAO token total supply:", error);
    throw error;
  }
};

export const getTokenSymbol = async (
  contractName: AvailableContractName
): Promise<string> => {
  try {
    const result = await contractReadPublic({
      contractName,
      functionName: "symbol",
    });

    return result as string;
  } catch (error) {
    console.error("Error fetching DAO token symbol:", error);
    throw error;
  }
};

export const getTokenName = async (
  contractName: AvailableContractName
): Promise<string> => {
  try {
    const result = await contractReadPublic({
      contractName,
      functionName: "name",
    });

    return result as string;
  } catch (error) {
    console.error("Error fetching DAO token name:", error);
    throw error;
  }
};

export const getDAOMetrics = async () => {
  await wait(3000);
  try {
    const [totalSupply, tokenName, tokenSymbol] = await Promise.all([
      totalSupplyDaoToken(),
      getTokenName("DAOToken"),
      getTokenSymbol("DAOToken"),
    ]);

    return {
      totalSupply,
      tokenName,
      tokenSymbol,
    };
  } catch (error) {
    console.error("Error fetching DAO metrics:", error);
    throw error;
  }
};

export const totalSupplyETHToken = async (): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "ETHToken",
      functionName: "totalSupply",
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching ETH token total supply:", error);
    throw error;
  }
};

export const getTreasuryETHTokenBalance = async (): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "ETHToken",
      functionName: "balanceOf",
      args: [getContractAddress("Treasury")],
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching treasury ETH token balance:", error);
    throw error;
  }
};

export const getETHTokenMetrics = async () => {
  await wait(3000);

  try {
    const [totalSupply, tokenName, tokenSymbol] = await Promise.all([
      totalSupplyETHToken(),
      getTokenName("ETHToken"),
      getTokenSymbol("ETHToken"),
    ]);

    return {
      totalSupply,
      tokenName,
      tokenSymbol,
    };
  } catch (error) {
    console.error("Error fetching ETH token metrics:", error);
    throw error;
  }
};
