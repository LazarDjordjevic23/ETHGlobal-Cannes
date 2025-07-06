/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import {
  getChainByChainId,
  getRpcUrlByChainId,
  type AvailableChainId,
} from "@/constants/chains";
import type { Address, Abi, WalletClient } from "viem";

import contractAddresses from "../../../contracts/scripts/deployments/develop-contract-addresses.json";
import contractAbis from "../../../contracts/scripts/deployments/develop-contract-abis.json";

export type ChainName = keyof typeof contractAddresses;

export type ContractName = keyof (typeof contractAddresses)[ChainName];

export type AvailableContractName =
  | "DAOToken"
  | "Governance"
  | "Treasury"
  | "ETHToken"
  | "Strategy"
  | "EntryPoint"
  | "SimpleAccountFactory"
  | "SimplePaymaster"
  | "AIAgentAccount"
  | "AIAgentEOA";

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

export { contractAddresses, contractAbis };

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
  chainId?: AvailableChainId;
}) => {
  const currentChain = getChainByChainId(chainId);
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

export const contractWrite = async ({
  walletClient,
  functionName,
  contractName,
  args,
  contractAddress: passedContractAddress,
}: {
  walletClient: WalletClient;
  functionName: string;
  contractName: AvailableContractName;
  args: any;
  contractAddress?: `0x${string}`;
}) => {
  if (!walletClient || !walletClient.chain || !walletClient?.account?.address) {
    throw new Error(`Wallet not connected. Please connect your wallet first.`);
  }

  const currentChain = getChainByChainId(
    walletClient.chain.id as AvailableChainId
  );
  if (!currentChain) {
    throw new Error(
      `Unsupported chain: ${walletClient.chain.id}. Please switch to Arbitrum.`
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
