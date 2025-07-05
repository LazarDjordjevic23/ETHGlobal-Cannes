import {
  contractReadPublic,
  type AvailableContractName,
} from "./contract-interactions";
import { divideOnWei } from "./web3";

// Function to fetch total supply of DAO token
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

// Function to fetch DAO token symbol
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

// Function to fetch DAO token name
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

// Function to fetch treasury balance
export const getTreasuryBalance = async (): Promise<bigint> => {
  try {
    const result = await contractReadPublic({
      contractName: "Treasury",
      functionName: "getBalance",
    });

    return result as bigint;
  } catch (error) {
    console.error("Error fetching treasury balance:", error);
    throw error;
  }
};

// Function to fetch multiple DAO metrics at once
export const getDAOMetrics = async () => {
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

// Function to fetch ETH token total supply
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

// Function to fetch multiple ETH token metrics at once
export const getETHTokenMetrics = async () => {
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
