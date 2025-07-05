/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { getRpcUrlByChainId } from "@/constants/chains";
import type { Address, Abi } from "viem";

import contractAddresses from "../../../contracts/scripts/deployments/develop-contract-addresses.json";
import contractAbis from "../../../contracts/scripts/deployments/develop-contract-abis.json";

export type ChainName = keyof typeof contractAddresses;

export type ContractName = keyof (typeof contractAddresses)[ChainName];

export const AVAILABLE_CONTRACTS = [
  "DAOToken",
  "Governance",
  "Treasury",
  "ETHToken",
  "Strategy",
  "EntryPoint",
  "SimpleAccountFactory",
  "SimplePaymaster",
  "AIAgentAccount",
  "AIAgentEOA",
] as const;

export type AvailableContractName = (typeof AVAILABLE_CONTRACTS)[number];

export interface ContractConfig {
  address: Address;
  abi: Abi;
}
export function getContractConfig(
  contractName: AvailableContractName,
  chainName: ChainName = "sepolia"
): ContractConfig {
  const address = contractAddresses[chainName]?.[contractName];
  const abi = contractAbis[chainName]?.[contractName];

  if (!address) {
    throw new Error(
      `Contract address not found for ${contractName} on ${chainName}`
    );
  }

  if (!abi) {
    throw new Error(
      `Contract ABI not found for ${contractName} on ${chainName}`
    );
  }

  return {
    address: address as Address,
    abi,
  };
}

export function getContractAddress(
  contractName: AvailableContractName,
  chainName: ChainName = "sepolia"
): Address {
  const address = contractAddresses[chainName]?.[contractName];

  if (!address) {
    throw new Error(
      `Contract address not found for ${contractName} on ${chainName}`
    );
  }

  return address as Address;
}

export function getContractAbi(
  contractName: AvailableContractName,
  chainName: ChainName = "sepolia"
): Abi {
  const abi = contractAbis[chainName]?.[contractName];

  if (!abi) {
    throw new Error(
      `Contract ABI not found for ${contractName} on ${chainName}`
    );
  }

  return abi;
}

export function getAllContracts(
  chainName: ChainName = "sepolia"
): Record<string, ContractConfig> {
  const contracts: Record<string, ContractConfig> = {};

  for (const contractName of AVAILABLE_CONTRACTS) {
    try {
      contracts[contractName] = getContractConfig(contractName, chainName);
    } catch (error) {
      console.warn(`Failed to load contract ${contractName}:`, error);
    }
  }

  return contracts;
}

export function contractExists(
  contractName: string,
  chainName: ChainName = "sepolia"
): contractName is AvailableContractName {
  return (
    AVAILABLE_CONTRACTS.includes(contractName as AvailableContractName) &&
    !!contractAddresses[chainName]?.[contractName as AvailableContractName] &&
    !!contractAbis[chainName]?.[contractName as AvailableContractName]
  );
}

export function getContractForWagmi(
  contractName: AvailableContractName,
  chainName: ChainName = "sepolia"
) {
  const config = getContractConfig(contractName, chainName);

  return {
    address: config.address,
    abi: config.abi,
    chainId: 11155111,
  };
}

export { contractAddresses, contractAbis };

export const getChainById = (chainId: number) => {
  return [sepolia].find((chain) => chain.id === chainId);
};

/* 
  Read from a contract
*/
export const contractRead = async ({
  walletClient,
  contractName,
  functionName,
  args = [],
  contractAddress: passedContractAddress,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  contractName: AvailableContractName;
  functionName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: any;
  contractAddress?: `0x${string}`;
}) => {
  if (!walletClient?.account?.address) {
    throw new Error(`Wallet not connected. Please connect your wallet first.`);
  }

  const currentChain = getChainById(walletClient.chain.id);
  if (!currentChain) {
    throw new Error(
      `Unsupported chain: ${walletClient.chain.id}. Please switch to Sepolia.`
    );
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const abi = getContractAbi(contractName);
  const contractAddress =
    passedContractAddress || getContractAddress(contractName);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  try {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName,
      args,
      account: walletClient.account.address,
    });

    return result;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/* 
  Write to a contract
*/
export const contractWrite = async ({
  walletClient,
  functionName,
  contractName,
  args,
  contractAddress: passedContractAddress,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  functionName: string;
  contractName: AvailableContractName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
  contractAddress?: `0x${string}`;
}) => {
  if (!walletClient?.account?.address) {
    throw new Error(`Wallet not connected. Please connect your wallet first.`);
  }

  const currentChain = getChainById(walletClient.chain.id);
  if (!currentChain) {
    throw new Error(
      `Unsupported chain: ${walletClient.chain.id}. Please switch to Sepolia.`
    );
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const abi = getContractAbi(contractName);
  const contractAddress =
    passedContractAddress || getContractAddress(contractName);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  try {
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName,
      args,
      account: walletClient.account.address,
      chain: currentChain,
    });

    const hash = await walletClient.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return { hash, receipt };
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/* 
  Read from a contract without wallet (for public data)
*/
export const contractReadPublic = async ({
  contractName,
  functionName,
  args = [],
  contractAddress: passedContractAddress,
  chainId = sepolia.id,
}: {
  contractName: AvailableContractName;
  functionName: string;
  args?: any;
  contractAddress?: `0x${string}`;
  chainId?: number;
}) => {
  const currentChain = getChainById(chainId);
  if (!currentChain) {
    throw new Error(`Unsupported chain: ${chainId}. Please use Sepolia.`);
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const abi = getContractAbi(contractName);
  const contractAddress =
    passedContractAddress || getContractAddress(contractName);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  try {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName,
      args,
    });

    return result;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/* 
  Batch read from multiple contracts
*/
export const contractBatchRead = async ({
  walletClient,
  calls,
}: {
  walletClient?: any;
  calls: Array<{
    contractName: AvailableContractName;
    functionName: string;
    args?: any;
    contractAddress?: `0x${string}`;
  }>;
}) => {
  const chainId = walletClient?.chain?.id || sepolia.id;
  const currentChain = getChainById(chainId);
  if (!currentChain) {
    throw new Error(`Unsupported chain: ${chainId}. Please use Sepolia.`);
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  const multicallParams = calls.map((call) => {
    const abi = getContractAbi(call.contractName);
    const contractAddress =
      call.contractAddress || getContractAddress(call.contractName);

    return {
      address: contractAddress,
      abi,
      functionName: call.functionName,
      args: call.args || [],
    };
  });

  try {
    const results = await publicClient.multicall({
      contracts: multicallParams,
    });

    return results;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/* 
  Get contract event logs
*/
export const getContractLogs = async ({
  contractName,
  eventName,
  fromBlock = "earliest",
  toBlock = "latest",
  contractAddress: passedContractAddress,
  chainId = sepolia.id,
}: {
  contractName: AvailableContractName;
  eventName: string;
  fromBlock?: bigint | "earliest";
  toBlock?: bigint | "latest";
  contractAddress?: `0x${string}`;
  chainId?: number;
}) => {
  const currentChain = getChainById(chainId);
  if (!currentChain) {
    throw new Error(`Unsupported chain: ${chainId}. Please use Sepolia.`);
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const abi = getContractAbi(contractName);
  const contractAddress =
    passedContractAddress || getContractAddress(contractName);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  try {
    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: abi.find(
        (item: any) => item.type === "event" && item.name === eventName
      ) as any,
      fromBlock,
      toBlock,
    });

    return logs;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/* 
  Estimate gas for a contract write
*/
export const estimateContractGas = async ({
  walletClient,
  contractName,
  functionName,
  args,
  contractAddress: passedContractAddress,
}: {
  walletClient: any;
  contractName: AvailableContractName;
  functionName: string;
  args: any;
  contractAddress?: `0x${string}`;
}) => {
  if (!walletClient?.account?.address) {
    throw new Error(`Wallet not connected. Please connect your wallet first.`);
  }

  const currentChain = getChainById(walletClient.chain.id);
  if (!currentChain) {
    throw new Error(
      `Unsupported chain: ${walletClient.chain.id}. Please switch to Sepolia.`
    );
  }

  const rpcUrl = getRpcUrlByChainId(currentChain.id);
  const abi = getContractAbi(contractName);
  const contractAddress =
    passedContractAddress || getContractAddress(contractName);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(rpcUrl),
  });

  try {
    const gasEstimate = await publicClient.estimateContractGas({
      address: contractAddress,
      abi,
      functionName,
      args,
      account: walletClient.account.address,
    });

    return gasEstimate;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
