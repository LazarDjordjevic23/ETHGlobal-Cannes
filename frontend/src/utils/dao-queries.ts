import type { AvailableChainId } from "@/constants/chains";
import {
  chainNameMapper,
  contractReadPublic,
  getContractAddress,
  type AvailableContractName,
} from "./contract-interactions";
import { wait } from "./time";
import { divideOnWei } from "./web3";
import { sepolia } from "viem/chains";

export const totalSupplyDaoToken = async ({
  chainId = sepolia.id,
}: {
  chainId?: AvailableChainId;
}): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "DAOToken",
      functionName: "totalSupply",
      chainId,
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

export const getDAOMetrics = async (chainId?: number | undefined) => {
  await wait(3000);
  try {
    const [totalSupply, tokenName, tokenSymbol] = await Promise.all([
      totalSupplyDaoToken({
        chainId: (chainId as AvailableChainId) || sepolia.id,
      }),
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

export const totalSupplyETHToken = async ({
  chainId = sepolia.id,
}: {
  chainId?: AvailableChainId;
}): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "ETHToken",
      functionName: "totalSupply",
      chainId,
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching ETH token total supply:", error);
    throw error;
  }
};

export const getTreasuryETHTokenBalance = async (
  chainId?: AvailableChainId
): Promise<number> => {
  // const treasuryAddress = "0x1416C74A29eC92Ccdd4b426316E6dfabcac85AE1";
  // const ethTokenAddress = "0xa1e5d49E35bAE2d4Ec6e940c9eFF3b77079F4C50";

  try {
    const result = await contractReadPublic({
      contractName: "ETHToken",
      functionName: "balanceOf",
      args: [
        getContractAddress(
          "Treasury",
          chainNameMapper[(chainId as AvailableChainId) || "sepolia"]
        ),
      ],
      chainId,
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching treasury ETH token balance:", error);
    throw error;
  }
};

export const getETHTokenMetrics = async (
  chainId?: AvailableChainId | undefined
) => {
  await wait(3000);

  try {
    const [totalSupply, tokenName, tokenSymbol] = await Promise.all([
      totalSupplyETHToken({ chainId: chainId || sepolia.id }),
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

export const getVotesForUser = async (
  userAddress: string,
  chainId: AvailableChainId
): Promise<number> => {
  try {
    const result = await contractReadPublic({
      contractName: "DAOToken",
      functionName: "getVotes",
      args: [userAddress],
      chainId,
    });

    return divideOnWei(result as bigint);
  } catch (error) {
    console.error("Error fetching voting power for user:", error);
    throw error;
  }
};
