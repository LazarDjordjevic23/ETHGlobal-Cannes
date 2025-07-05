import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAgent } from "@/contexts/agent-context";
import { getAgentFeatures } from "@/utils/agent-features";
import { useAccount } from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { executeProposalCreation } from "@/utils/proposal-queries";
import { wait } from "@/utils/time";
import { availableChains, type AvailableChainId } from "@/constants/chains";
import type { ProposalResponse } from "@/contexts/agent-context";

interface ProposalRequest {
  id: string;
  status: "idle" | "creating" | "completed" | "error";
  proposalLink?: string;
  timestamp?: Date;
  error?: string;
  txHash?: string;
  response?: ProposalResponse;
}

const RequestProposal = () => {
  const navigate = useNavigate();
  const { selectedAgent, setProposalData } = useAgent();
  const [proposalRequest, setProposalRequest] = useState<ProposalRequest>({
    id: "",
    status: "idle",
  });

  const { chainId, isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();

  const handleConnectWallet = () => {
    setShowAuthFlow(true);
  };

  const handleRequestProposal = async () => {
    const requestId = Date.now().toString();

    // Validate chainId
    const supportedChainIds = availableChains.map((chain) => chain.id);
    if (!chainId || !supportedChainIds.includes(chainId as AvailableChainId)) {
      setProposalRequest({
        id: requestId,
        status: "error",
        error:
          "Please connect to a supported network (Sepolia, Zircuit, Flow Testnet, or Mantle Sepolia Testnet)",
      });
      return;
    }

    setProposalRequest({
      id: requestId,
      status: "creating",
    });

    try {
      // Step 1: Analyzing treasury data
      await wait(1000);

      // Step 2: Reviewing governance structure
      await wait(1000);

      // Step 3: Assessing community needs
      await wait(1000);

      // Step 4: Drafting proposal content and executing
      await wait(500);

      // Execute the actual proposal creation
      const result = await executeProposalCreation({
        chainId: chainId as AvailableChainId,
      });

      console.log({ result });

      if (result) {
        // Store the full response in context
        setProposalData(result);

        setProposalRequest({
          id: requestId,
          status: "completed",
          proposalLink: `proposal-${result.strategy_id}`,
          timestamp: new Date(result.timestamp),
          txHash: result.tx_hash || result.txHash,
          response: result,
        });
      } else {
        throw new Error("Failed to create proposal - no response from backend");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      setProposalRequest({
        id: requestId,
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to create proposal",
      });
    }
  };

  const handleViewProposal = () => {
    if (proposalRequest.proposalLink) {
      navigate(`/proposal/${proposalRequest.proposalLink}`);
    }
  };

  const handleCreateAnother = () => {
    setProposalRequest({
      id: "",
      status: "idle",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Proposal Assistant
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Let our AI agent analyze your DAO's current state and create
          intelligent proposals
        </p>

        {/* Selected Agent Display */}
        {selectedAgent && (
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl px-6 py-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {selectedAgent.name.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">
                Selected Agent: {selectedAgent.name}
              </div>
              <div className="text-xs text-gray-600">
                {selectedAgent.status} • {selectedAgent.risk} Risk
              </div>
            </div>
          </motion.div>
        )}

        {!selectedAgent && (
          <motion.div
            className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm text-yellow-800">
              No agent selected. Please choose an agent first.
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Status Display */}
        <div className="p-8">
          {proposalRequest.status === "idle" && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* AI Agent Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">🤖</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Ready to Create Your Proposal
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedAgent ? (
                    <>
                      <strong>{selectedAgent.name}</strong> will analyze your
                      DAO's treasury, governance structure, and community needs
                      to create a comprehensive proposal using its{" "}
                      <strong>{selectedAgent.strategy}</strong> strategy.
                    </>
                  ) : (
                    "Please select an AI agent first. The agent will analyze your DAO's treasury, governance structure, and community needs to create a comprehensive proposal."
                  )}
                </p>
              </div>

              {/* Main Action Button */}
              <motion.button
                onClick={
                  selectedAgent && isConnected
                    ? handleRequestProposal
                    : !selectedAgent
                    ? undefined
                    : handleConnectWallet
                }
                disabled={!selectedAgent}
                className={`font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform ${
                  selectedAgent && isConnected
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105"
                    : selectedAgent && !isConnected
                    ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedAgent ? { scale: 1.05 } : {}}
                whileTap={selectedAgent ? { scale: 0.95 } : {}}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">
                    {selectedAgent && isConnected
                      ? "✨"
                      : selectedAgent && !isConnected
                      ? "🔗"
                      : "🚫"}
                  </span>
                  {selectedAgent && isConnected
                    ? `Ask ${selectedAgent.name} to Create Proposal`
                    : !selectedAgent
                    ? "Select an Agent First"
                    : "Connect to Supported Network"}
                  <span className="text-xl">
                    {selectedAgent && isConnected
                      ? "✨"
                      : selectedAgent && !isConnected
                      ? "🔗"
                      : "🚫"}
                  </span>
                </span>
              </motion.button>
            </motion.div>
          )}

          {proposalRequest.status === "creating" && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Animated Loading Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <motion.span
                  className="text-4xl text-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedAgent?.name} is Creating Your Proposal
                </h3>
                <p className="text-gray-600">
                  {selectedAgent?.name} is analyzing your DAO's data using its{" "}
                  <strong>{selectedAgent?.strategy}</strong> strategy and
                  crafting a comprehensive proposal...
                </p>

                {/* Progress Steps */}
                <div className="space-y-3 mt-6">
                  {[
                    "Analyzing treasury data",
                    "Reviewing governance structure",
                    "Assessing community needs",
                    "Drafting proposal content",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5, duration: 0.3 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {proposalRequest.status === "completed" && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Success Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">✅</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Proposal Created Successfully!
                </h3>
                <p className="text-gray-600">
                  {selectedAgent?.name} has analyzed your DAO's current state
                  using its <strong>{selectedAgent?.strategy}</strong> strategy
                  and created a comprehensive proposal tailored to your
                  organization's needs.
                </p>

                {proposalRequest.timestamp && (
                  <p className="text-sm text-gray-500">
                    Created at {proposalRequest.timestamp.toLocaleString()}
                  </p>
                )}

                {/* AI Analysis Summary */}
                {proposalRequest.response && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      AI Analysis Summary
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Strategy ID:</strong>{" "}
                      {proposalRequest.response.strategy_id}
                    </p>
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Expected Profit:</strong>{" "}
                      {
                        proposalRequest.response.ai_analysis
                          .strategy_recommendation.expected_profit
                      }
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Status:</strong>{" "}
                      {proposalRequest.response.ai_analysis.final_output}
                    </p>
                  </div>
                )}

                {proposalRequest.txHash && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-sm text-gray-600 mb-2">
                      Transaction Hash:
                    </p>
                    <p className="text-xs font-mono text-gray-800 break-all">
                      {proposalRequest.txHash}
                    </p>
                    {proposalRequest.response?.tx_url && (
                      <a
                        href={proposalRequest.response.tx_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                      >
                        View on Etherscan →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleViewProposal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Proposal →
                </motion.button>

                <motion.button
                  onClick={handleCreateAnother}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Another
                </motion.button>
              </div>
            </motion.div>
          )}

          {proposalRequest.status === "error" && (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Error Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">❌</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Proposal Creation Failed
                </h3>
                <p className="text-gray-600">
                  {proposalRequest.error ||
                    "An unexpected error occurred while creating the proposal."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleCreateAnother}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          {selectedAgent
            ? `What ${selectedAgent.name} Considers`
            : "What Our AI Agent Considers"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getAgentFeatures(selectedAgent).map((feature, index) => (
            <motion.div
              key={index}
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RequestProposal;
