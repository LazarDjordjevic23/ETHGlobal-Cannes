import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAgent } from "@/contexts/agent-context";
import { getAgentFeatures } from "@/utils/agent-features";

interface ProposalRequest {
  id: string;
  status: "idle" | "creating" | "completed";
  proposalLink?: string;
  timestamp?: Date;
}

const RequestProposal = () => {
  const navigate = useNavigate();
  const { selectedAgent } = useAgent();
  const [proposalRequest, setProposalRequest] = useState<ProposalRequest>({
    id: "",
    status: "idle",
  });

  const handleRequestProposal = async () => {
    const requestId = Date.now().toString();

    setProposalRequest({
      id: requestId,
      status: "creating",
    });

    setTimeout(() => {
      setProposalRequest({
        id: requestId,
        status: "completed",
        proposalLink: `proposal-${requestId}`,
        timestamp: new Date(),
      });
    }, 3000);
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
                onClick={handleRequestProposal}
                disabled={!selectedAgent}
                className={`font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform ${
                  selectedAgent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedAgent ? { scale: 1.05 } : {}}
                whileTap={selectedAgent ? { scale: 0.95 } : {}}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{selectedAgent ? "✨" : "🚫"}</span>
                  {selectedAgent
                    ? `Ask ${selectedAgent.name} to Create Proposal`
                    : "Select an Agent First"}
                  <span className="text-xl">{selectedAgent ? "✨" : "🚫"}</span>
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
