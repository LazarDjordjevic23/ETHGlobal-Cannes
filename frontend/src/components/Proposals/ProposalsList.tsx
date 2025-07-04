import { motion } from "framer-motion";
import { useNavigate } from "react-router";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "closed";
  createdBy: string;
  createdAt: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  endDate: string;
  aiReasoning?: string;
}

const ProposalsList = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from your backend/blockchain
  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Increase Treasury Allocation for DeFi Yield Farming",
      description:
        "Proposal to allocate 30% of treasury funds to high-yield DeFi protocols to maximize returns for the DAO.",
      status: "live",
      createdBy: "AI Agent",
      createdAt: "2024-01-15",
      votes: { for: 1234, against: 89, abstain: 45 },
      endDate: "2024-01-22",
      aiReasoning:
        "Based on market analysis, current DeFi yields are at 12-18% APY, significantly higher than traditional treasury management. This allocation would optimize our treasury performance while maintaining acceptable risk levels.",
    },
    {
      id: "2",
      title: "Implement Multi-Chain Treasury Management",
      description:
        "Deploy treasury management across Ethereum, Arbitrum, and Polygon to optimize gas costs and maximize yield opportunities.",
      status: "pending",
      createdBy: "AI Agent",
      createdAt: "2024-01-14",
      votes: { for: 0, against: 0, abstain: 0 },
      endDate: "2024-01-21",
      aiReasoning:
        "Cross-chain analysis shows 40% lower transaction costs on Layer 2 solutions while maintaining similar yield opportunities. This diversification reduces risk and increases efficiency.",
    },
    {
      id: "3",
      title: "Launch Community Incentive Program",
      description:
        "Establish a reward system for active community members contributing to governance and protocol development.",
      status: "closed",
      createdBy: "AI Agent",
      createdAt: "2024-01-10",
      votes: { for: 2156, against: 234, abstain: 123 },
      endDate: "2024-01-17",
      aiReasoning:
        "Community engagement metrics show 60% participation could increase with proper incentive structures. This program targets key contributors who drive DAO success.",
    },
  ];

  const getStatusColor = (status: Proposal["status"]) => {
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

  const getStatusIcon = (status: Proposal["status"]) => {
    switch (status) {
      case "live":
        return "🟢";
      case "pending":
        return "🟡";
      case "closed":
        return "⚪";
      default:
        return "⚪";
    }
  };

  const handleProposalClick = (proposalId: string) => {
    navigate(`/proposal/${proposalId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Proposals</h2>
        <p className="text-gray-600">
          View and participate in DAO governance proposals
        </p>
      </motion.div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleProposalClick(proposal.id)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">
                      {getStatusIcon(proposal.status)}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        proposal.status
                      )}`}
                    >
                      {proposal.status.toUpperCase()}
                    </span>
                    {proposal.createdBy === "AI Agent" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        🤖 AI Generated
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {proposal.description}
                  </p>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">
                      ✓ {proposal.votes.for}
                    </span>
                    <span className="text-red-600 font-medium">
                      ✗ {proposal.votes.against}
                    </span>
                    <span className="text-gray-500 font-medium">
                      ~ {proposal.votes.abstain}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(proposal.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {proposal.status === "live" && (
                    <span className="text-orange-600 font-medium">
                      Ends: {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  )}
                  {proposal.status === "closed" && (
                    <span className="text-gray-600">
                      Ended: {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  )}
                  {proposal.status === "pending" && (
                    <span className="text-blue-600 font-medium">
                      Starts Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {proposals.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No proposals yet
          </h3>
          <p className="text-gray-600">
            Be the first to create a proposal for your DAO
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProposalsList;
