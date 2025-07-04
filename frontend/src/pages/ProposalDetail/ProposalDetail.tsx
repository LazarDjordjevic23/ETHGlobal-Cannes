import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";

interface ProposalData {
  id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "closed";
  createdBy: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
    total: number;
  };
  quorum: number;
  aiReasoning: string;
  details: string;
  transactions: Array<{
    target: string;
    value: string;
    function: string;
    inputs: string;
  }>;
}

const ProposalDetail = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [selectedVote, setSelectedVote] = useState<
    "for" | "against" | "abstain" | null
  >(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock data - in real app this would come from your backend/blockchain
  const proposalData: ProposalData = {
    id: proposalId || "1",
    title: "Increase Treasury Allocation for DeFi Yield Farming",
    description:
      "This proposal aims to allocate 30% of our treasury funds to high-yield DeFi protocols to maximize returns for the DAO while maintaining acceptable risk levels.",
    status: "live",
    createdBy: "AI Agent",
    createdAt: "2024-01-15T10:00:00Z",
    startDate: "2024-01-16T00:00:00Z",
    endDate: "2024-01-22T23:59:59Z",
    votes: {
      for: 1234,
      against: 89,
      abstain: 45,
      total: 1368,
    },
    quorum: 1000,
    aiReasoning:
      "Based on comprehensive market analysis and risk assessment, I identified several key factors that support this proposal:\n\n1. **Market Opportunity**: Current DeFi yields are significantly higher than traditional treasury management, with established protocols offering 12-18% APY.\n\n2. **Risk Mitigation**: The proposed allocation of 30% maintains a conservative approach while still capturing meaningful yield opportunities. This leaves 70% in stable, liquid assets.\n\n3. **Protocol Selection**: I analyzed over 50 DeFi protocols and identified those with:\n   - Proven track records (2+ years)\n   - Strong security audits\n   - Consistent yield performance\n   - High TVL and liquidity\n\n4. **Treasury Optimization**: Our current treasury of $2.4M is underperforming. This strategy could generate an additional $86,400 annually compared to current yield.\n\n5. **Community Benefit**: Increased treasury returns directly benefit all token holders and provide more resources for DAO operations and community initiatives.",
    details:
      "## Overview\n\nThis proposal outlines a strategic shift in our treasury management approach to optimize yield generation while maintaining security and liquidity.\n\n## Proposed Changes\n\n### Allocation Strategy\n- **30% to DeFi Yield Farming**: $720,000 allocated to selected protocols\n- **50% in Stablecoins**: $1,200,000 maintained for liquidity\n- **20% in DAO Token**: $480,000 for governance and strategic reserves\n\n### Target Protocols\n1. **Aave** - 40% of DeFi allocation\n2. **Compound** - 30% of DeFi allocation\n3. **Yearn Finance** - 20% of DeFi allocation\n4. **Curve** - 10% of DeFi allocation\n\n### Risk Management\n- Maximum 5% exposure to any single protocol\n- Quarterly rebalancing based on performance\n- Emergency withdrawal procedures\n- Multi-signature requirement for all transactions\n\n## Expected Outcomes\n\n- **Projected Annual Yield**: 14.5% average\n- **Additional Revenue**: ~$104,000 annually\n- **Risk Level**: Medium (diversified across established protocols)\n- **Liquidity Impact**: Minimal (70% remains liquid)\n\n## Implementation Timeline\n\n- **Week 1**: Finalize protocol selection and due diligence\n- **Week 2**: Deploy initial 10% allocation for testing\n- **Week 3-4**: Gradual deployment of full allocation\n- **Ongoing**: Monthly performance reviews and adjustments",
    transactions: [
      {
        target: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
        value: "720000000000000000000000",
        function: "deposit",
        inputs: "asset: USDC, amount: 720000000000",
      },
    ],
  };

  const getStatusColor = (status: ProposalData["status"]) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleVote = (vote: "for" | "against" | "abstain") => {
    setSelectedVote(vote);
    setHasVoted(true);
    // In real app, this would submit the vote to the blockchain
  };

  const getVotePercentage = (voteCount: number) => {
    return proposalData.votes.total > 0
      ? (voteCount / proposalData.votes.total) * 100
      : 0;
  };

  const isQuorumMet = proposalData.votes.total >= proposalData.quorum;

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/proposal")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Proposals
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    proposalData.status
                  )}`}
                >
                  {proposalData.status.toUpperCase()}
                </span>
                {proposalData.createdBy === "AI Agent" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    🤖 AI Generated
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {proposalData.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {proposalData.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  Created:{" "}
                  {new Date(proposalData.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>
                  Voting ends:{" "}
                  {new Date(proposalData.endDate).toLocaleDateString()}
                </span>
              </div>
            </motion.div>

            {/* AI Agent Reasoning - Special Section */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    AI Agent Analysis
                  </h3>
                  <p className="text-sm text-gray-600">
                    Why this proposal was created
                  </p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {proposalData.aiReasoning}
                </pre>
              </div>
            </motion.div>

            {/* Proposal Details */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Proposal Details
              </h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {proposalData.details}
                </div>
              </div>
            </motion.div>

            {/* Transactions */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Proposed Transactions
              </h3>
              <div className="space-y-3">
                {proposalData.transactions.map((tx, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Target:
                        </span>
                        <span className="ml-2 text-gray-600 font-mono">
                          {tx.target}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Function:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {tx.function}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">
                          Inputs:
                        </span>
                        <span className="ml-2 text-gray-600 font-mono">
                          {tx.inputs}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Voting Sidebar */}
          <div className="space-y-6">
            {/* Voting Results */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Voting Results
              </h3>

              {/* Vote Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600 font-medium">For</span>
                    <span className="text-gray-600">
                      {proposalData.votes.for} (
                      {getVotePercentage(proposalData.votes.for).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${getVotePercentage(proposalData.votes.for)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600 font-medium">Against</span>
                    <span className="text-gray-600">
                      {proposalData.votes.against} (
                      {getVotePercentage(proposalData.votes.against).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${getVotePercentage(
                          proposalData.votes.against
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">Abstain</span>
                    <span className="text-gray-600">
                      {proposalData.votes.abstain} (
                      {getVotePercentage(proposalData.votes.abstain).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${getVotePercentage(
                          proposalData.votes.abstain
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quorum Status */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    Quorum ({proposalData.quorum} required)
                  </span>
                  <span
                    className={`font-medium ${
                      isQuorumMet ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isQuorumMet ? "Met" : "Not Met"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isQuorumMet ? "bg-green-600" : "bg-orange-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (proposalData.votes.total / proposalData.quorum) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {proposalData.votes.total} / {proposalData.quorum} votes
                </div>
              </div>
            </motion.div>

            {/* Voting Interface */}
            {proposalData.status === "live" && (
              <motion.div
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Cast Your Vote
                </h3>
                {!hasVoted ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleVote("for")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => handleVote("against")}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Vote Against
                    </button>
                    <button
                      onClick={() => handleVote("abstain")}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Abstain
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-green-600 text-4xl mb-2">✓</div>
                    <p className="text-gray-900 font-medium">Vote Cast!</p>
                    <p className="text-sm text-gray-600">
                      You voted: {selectedVote}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalDetail;
