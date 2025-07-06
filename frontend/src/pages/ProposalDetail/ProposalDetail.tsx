import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import BackButton from "./BackButton/BackButton";
import ProposalHeader from "../../components/ProposalHeader/ProposalHeader";
import AIAgentReasoning from "./AIAgentReasoning/AIAgentReasoning";
import ProposalDetails from "./ProposalDetails/ProposalDetails";
import VotingResults from "./VotingResults/VotingResults";
import VotingPower from "./VotingPower/VotingPower";
import CastVote from "./CastVote/CastVote";
import { useQuery } from "@tanstack/react-query";
import {
  getProposalVotes,
  getLastProposal,
} from "../../utils/proposal-queries";
import { useAgent } from "@/contexts/agent-context";
import { totalSupplyDaoToken } from "@/utils/dao-queries";

export interface Votes {
  for: number;
  against: number;
  abstain: number;
  total: number;
}

interface ProposalData {
  id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "closed";
  createdBy: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  votes: Votes;
  quorum: number;
  aiReasoning: string;
  details: string;
  transactions: Array<{
    target: string;
    value: string;
    function: string;
    inputs: string;
  }>;
  strategyId?: number;
  expectedProfit?: string;
  txUrl?: string;
  txHash?: string;
}

const ProposalDetail = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const { proposalData: contextProposalData } = useAgent();

  // Fetch proposal by index (assuming proposalId is the index)
  const { data: proposal } = useQuery({
    queryKey: ["last-proposal"],
    queryFn: getLastProposal,
    enabled: !!proposalId,
  });

  // Fetch votes for the proposal
  const { data: votes } = useQuery({
    queryKey: ["proposal-votes", proposal?.proposalId],
    queryFn: () => getProposalVotes(proposal!.proposalId),
    enabled: !!proposal?.proposalId,
  });

  const { data: totalSupply } = useQuery({
    queryKey: ["total-supply"],
    queryFn: totalSupplyDaoToken,
  });

  console.log({ proposal, votes, contextProposalData });

  // Create details from blockchain data if proposal exists
  const getProposalDetails = () => {
    if (!proposal) {
      return "Loading proposal details...";
    }

    return `## Proposal Details

**Proposal ID:** ${proposal.proposalId}

**Index:** ${proposal.index}

**Proposer:** ${proposal.proposer}

**Target Contracts:** ${proposal.targetContracts.join(", ")}

**ETH Amount:** ${proposal.ethSpent.join(", ")} ETH

**Execution Function:** ${proposal.executionFunction || "N/A"}

**Description Hash:** ${proposal.hashedDescription}

## Execution Details

This proposal will execute the following operations:
- Target: ${proposal.targetContracts[0] || "N/A"}
- Value: ${proposal.ethSpent[0] || "0"} ETH
- Function: ${proposal.executionFunction || "N/A"}
`;
  };

  // Generate description based on AI analysis
  const getProposalDescription = () => {
    if (contextProposalData?.ai_analysis?.strategy_recommendation?.reasoning) {
      return contextProposalData.ai_analysis.strategy_recommendation.reasoning;
    }
    return "This proposal aims to optimize treasury management through strategic DeFi protocol integration to maximize returns while maintaining acceptable risk levels.";
  };

  const proposalData: ProposalData = {
    id: proposalId || "1",
    title: "Invest in Strategy",
    description: getProposalDescription(),
    status: "live",
    createdBy: "AI Agent",
    createdAt: contextProposalData?.timestamp || Date.now().toString(),
    startDate: contextProposalData?.timestamp || Date.now().toString(),
    endDate: new Date(
      (contextProposalData?.timestamp
        ? new Date(contextProposalData.timestamp).getTime()
        : Date.now()) +
        1000 * 60 * 60 * 24 * 7
    ).toISOString(),

    votes: votes || {
      for: 1234,
      against: 89,
      abstain: 45,
      total: 1368,
    },
    quorum: totalSupply || 0,
    aiReasoning:
      contextProposalData?.reasoning ||
      "Based on comprehensive market analysis and risk assessment, I identified several key factors that support this proposal:\n\n1. **Market Opportunity**: Current DeFi yields are significantly higher than traditional treasury management, with established protocols offering 12-18% APY.\n\n2. **Risk Mitigation**: The proposed allocation maintains a conservative approach while still capturing meaningful yield opportunities.\n\n3. **Protocol Selection**: I analyzed multiple DeFi protocols and identified those with proven track records, strong security audits, and consistent yield performance.\n\n4. **Treasury Optimization**: This strategy will generate additional returns compared to current yield.\n\n5. **Community Benefit**: Increased treasury returns directly benefit all token holders and provide more resources for DAO operations and community initiatives.",
    details: getProposalDetails(),
    transactions: [
      {
        target: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
        value: "720000000000000000000000",
        function: "deposit",
        inputs: "asset: USDC, amount: 720000000000",
      },
    ],
    strategyId: contextProposalData?.strategy_id,
    expectedProfit:
      contextProposalData?.ai_analysis?.strategy_recommendation
        ?.expected_profit,
    txUrl: contextProposalData?.tx_url,
    txHash: contextProposalData?.tx_hash || contextProposalData?.txHash,
  };

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <BackButton onClick={() => navigate("/proposal")} />

        {/* Strategy and Profit Info */}
        {(proposalData.strategyId || proposalData.expectedProfit) && (
          <motion.div
            className="mb-6 bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex flex-wrap gap-4 items-center">
              {proposalData.strategyId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <span className="text-sm font-semibold text-blue-900">
                    Strategy ID: {proposalData.strategyId}
                  </span>
                </div>
              )}
              {proposalData.expectedProfit && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <span className="text-sm font-semibold text-green-900">
                    Expected Profit: {proposalData.expectedProfit}
                  </span>
                </div>
              )}
              {proposalData.txUrl && (
                <a
                  href={proposalData.txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  View Transaction →
                </a>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <ProposalHeader
              title={proposalData.title}
              status={proposalData.status}
              createdBy={proposalData.createdBy}
              createdAt={proposalData.createdAt}
              endDate={proposalData.endDate}
            />

            {/* AI Agent Reasoning - Special Section */}
            <AIAgentReasoning reasoning={proposalData.aiReasoning} />

            {/* Proposal Details */}
            <ProposalDetails details={proposalData.details} />
          </div>

          {/* Voting Sidebar */}
          <div className="space-y-6">
            {/* Voting Results */}
            <VotingResults
              votes={proposalData.votes}
              quorum={proposalData.quorum}
            />

            {/* Voting Power */}
            <VotingPower totalSupply={proposalData.quorum} />

            {/* Voting Interface */}
            <CastVote
              proposalStatus={proposalData.status}
              proposalId={proposal?.proposalId}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalDetail;
