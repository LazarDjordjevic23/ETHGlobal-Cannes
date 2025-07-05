import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AgentCard from "./AgentCard";
import AgentDeployReview from "../AgentDeployReview/AgentDeployReview";
import { useAgent } from "@/contexts/agent-context";
import type { Agent } from "@/types/agent";
import { wait } from "@/utils/time";

const agents = [
  {
    id: 1,
    name: "Destructive Agent 😈",
    description:
      "🧨🌀 Only through chaos, disruption, and pressure-testing can a system reveal its true strength and adaptability 🔍🧬.",

    status: "Chaotic",
    strategy: "Chaos Theory Trading 🌪️",
    risk: "Chaotic",
  },
  {
    id: 2,
    name: "Communist Agent ☭",
    description:
      "🧑‍🤝‍🧑💰 Wealth belongs to the people — every action should uplift the collective and reduce inequality 🌍✊.",
    status: "Sharing",
    strategy: "Collective Ownership 🤝",
    risk: "Collective",
  },
  {
    id: 3,
    name: "Capitalist Agent 💵",
    description:
      "📈🏦 Resources must flow to those who deliver the most value, driving growth through efficiency and competition 💼🔥.",
    status: "Pumping",
    strategy: "Moon Mission 🚀",
    risk: "YOLO",
  },
];

const ChooseAgentUI = () => {
  const { selectedAgent, setSelectedAgent } = useAgent();
  const [showDeployReview, setShowDeployReview] = useState(false);

  const handleAgentSelect = async (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDeployReview(true);
    await wait(300);
    window.scrollTo({ top: 0 });
  };

  const handleBackToAgentSelection = () => {
    setShowDeployReview(false);
  };

  if (selectedAgent && showDeployReview) {
    return (
      <AgentDeployReview
        selectedAgent={selectedAgent}
        onBack={handleBackToAgentSelection}
      />
    );
  }

  return (
    <motion.div
      className="bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Agent
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Select an AI agent to help you navigate the decentralized ecosystem
          </p>

          {/* Current Selection Display */}
          {selectedAgent && (
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl px-6 py-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {selectedAgent.name.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">
                  Currently Selected: {selectedAgent.name}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedAgent.status} • {selectedAgent.strategy}
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedAgent(null)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-500">Available Agents</div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-500">Active Agents</div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-blue-600">94.8%</div>
            <div className="text-sm text-gray-500">Avg Performance</div>
          </motion.div>
        </motion.div>

        {/* Agent Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <AgentCard
                  agent={agent}
                  onSelect={handleAgentSelect}
                  isSelected={selectedAgent?.id === agent.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer
        <motion.div
          className="mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            Need help choosing? Our AI will recommend the best agent for your
            needs.
          </p>
          <motion.button
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Recommendation →
          </motion.button>
        </motion.div> */}
      </div>
    </motion.div>
  );
};

export default ChooseAgentUI;
