import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import BackButton from "./BackButton/BackButton";
import ProposalHeader from "../../components/ProposalHeader/ProposalHeader";
import AIAgentReasoning from "./AIAgentReasoning/AIAgentReasoning";
import ProposalDetails from "./ProposalDetails/ProposalDetails";
import ProposalTransactions from "./ProposalTransactions/ProposalTransactions";
import VotingResults from "./VotingResults/VotingResults";
import CastVote from "./CastVote/CastVote";

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
        <BackButton onClick={() => navigate("/proposal")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <ProposalHeader
              title={proposalData.title}
              description={proposalData.description}
              status={proposalData.status}
              createdBy={proposalData.createdBy}
              createdAt={proposalData.createdAt}
              endDate={proposalData.endDate}
            />

            {/* AI Agent Reasoning - Special Section */}
            <AIAgentReasoning reasoning={proposalData.aiReasoning} />

            {/* Proposal Details */}
            <ProposalDetails details={proposalData.details} />

            {/* Transactions */}
            <ProposalTransactions transactions={proposalData.transactions} />
          </div>

          {/* Voting Sidebar */}
          <div className="space-y-6">
            {/* Voting Results */}
            <VotingResults
              votes={proposalData.votes}
              quorum={proposalData.quorum}
            />

            {/* Voting Interface */}
            <CastVote proposalStatus={proposalData.status} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalDetail;
