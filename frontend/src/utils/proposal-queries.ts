import type { WalletClient } from "viem";
import { contractReadPublic, contractWrite } from "./contract-interactions";
import { divideOnWei } from "./web3";
import type { AvailableChainId } from "@/constants/chains";

export interface ProposalDetails {
  index: number;
  proposer: string;
  proposalId: string;
  targetContracts: string[];
  ethSpent: string[];
  executionFunction: string | null;
  hashedDescription: string;
}

function decodeCalldata(): string {
  return "Treasury.execute(Strategy, 0 ETH, executeStrategy1(ETHToken, 1 ETH))";
}

export async function getLastProposal(): Promise<ProposalDetails | null> {
  try {
    const proposalCount = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalCount",
      args: [],
    });

    console.log(`Total proposals: ${proposalCount}`);

    if (proposalCount === 0n) {
      console.log("No proposals found");
      return null;
    }

    const lastIndex = Number(proposalCount) - 1;
    const proposalDetails = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalDetailsAt",
      args: [lastIndex],
    });

    const [proposalId, targets, values, calldatas, descriptionHash] =
      proposalDetails as [bigint, string[], bigint[], string[], string];

    const proposer = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalProposer",
      args: [proposalId],
    });

    let executionFunction: string | null = null;
    if (calldatas.length > 0) {
      executionFunction = decodeCalldata();
    }

    return {
      index: lastIndex,
      proposer: proposer as string,
      proposalId: proposalId.toString(),
      targetContracts: targets,
      ethSpent: values.map((v) => v.toString()),
      executionFunction,
      hashedDescription: descriptionHash,
    };
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return null;
  }
}

export async function getProposalByIndex(
  index: number
): Promise<ProposalDetails | null> {
  try {
    const proposalDetails = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalDetailsAt",
      args: [index],
    });

    const [proposalId, targets, values, calldatas, descriptionHash] =
      proposalDetails as [bigint, string[], bigint[], string[], string];

    const proposer = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalProposer",
      args: [proposalId],
    });

    let executionFunction: string | null = null;
    if (calldatas.length > 0) {
      executionFunction = decodeCalldata();
    }

    return {
      index: index,
      proposer: proposer as string,
      proposalId: proposalId.toString(),
      targetContracts: targets,
      ethSpent: values.map((v) => v.toString()),
      executionFunction,
      hashedDescription: descriptionHash,
    };
  } catch (error) {
    console.error("Error fetching proposal by index:", error);
    return null;
  }
}

export async function getAllProposals(): Promise<ProposalDetails[]> {
  try {
    const proposalCount = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalCount",
      args: [],
    });

    const count = Number(proposalCount);
    console.log(`Total proposals: ${count}`);

    if (count === 0) {
      console.log("No proposals found");
      return [];
    }

    const proposals: ProposalDetails[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const proposal = await getProposalByIndex(i);
        if (proposal) {
          proposals.push(proposal);
          console.log(`✅ Fetched proposal ${i + 1}/${count}`);
        }
      } catch (error) {
        console.error(`❌ Failed to fetch proposal ${i}:`, error);
      }
    }

    return proposals;
  } catch (error) {
    console.error("Error fetching all proposals:", error);
    return [];
  }
}

export async function getProposalCount(): Promise<number> {
  try {
    const count = await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalCount",
      args: [],
    });

    return Number(count);
  } catch (error) {
    console.error("Error fetching proposal count:", error);
    return 0;
  }
}

export async function getProposalVotes(proposalId: string) {
  try {
    const votes = (await contractReadPublic({
      contractName: "Governance",
      functionName: "proposalVotes",
      args: [proposalId],
    })) as [bigint, bigint, bigint];

    return {
      against: divideOnWei(votes[0]),
      for: divideOnWei(votes[1]),
      abstain: divideOnWei(votes[2]),
      total: divideOnWei(votes[0] + votes[1] + votes[2]),
    };
  } catch (error) {
    console.error("Error fetching proposal votes:", error);
  }
}

export async function castVote(
  proposalId: string,
  vote: 0 | 1 | 2,
  walletClient: WalletClient
) {
  console.log({ vote });
  try {
    const tx = await contractWrite({
      walletClient: walletClient,
      contractName: "Governance",
      functionName: "castVote",
      args: [BigInt(proposalId), vote],
    });

    return tx;
  } catch (error) {
    console.error("Error casting vote:", error);
  }
}

export async function executeProposalCreation({
  chainId,
}: {
  chainId: AvailableChainId;
}) {
  const paramMapper: Record<AvailableChainId, string> = {
    11155111: "ethereum",
    48898: "zuircuit",
    545: "flow",
    5003: "mantle",
  };

  try {
    const res = await fetch(
      `http://localhost:8000/propose?chain=${paramMapper[chainId]}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error creating proposal:", error);
  }
}
