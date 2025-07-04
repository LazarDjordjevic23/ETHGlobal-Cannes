import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AgentCard from "./AgentCard";
import AgentDeployReview from "../AgentDeployReview/AgentDeployReview";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  strategy: string;
  risk: string;
}

const agents = [
  {
    id: 1,
    name: "Distractive Agent 🐱",
    description:
      "Gets distracted by cat videos, memes, and shiny objects. Will probably forget your portfolio exists but hey, at least you'll have fun! 😅✨",
    status: "Distracted",
    strategy: "Chaos Theory Trading 🌪️",
    risk: "Chaotic",
  },
  {
    id: 2,
    name: "Communist Agent ☭",
    description:
      "OUR portfolio comrade! Redistributes your gains to everyone. No private keys, only WE keys! 🤝🔴",
    status: "Sharing",
    strategy: "Collective Ownership 🤝",
    risk: "Collective",
  },
  {
    id: 3,
    name: "Capitalist Agent 💎",
    description:
      "Diamond hands 💎🙌 Number go up! Will sell your house to buy more crypto. To the moon! 🚀📈",
    status: "Pumping",
    strategy: "Moon Mission 🚀",
    risk: "YOLO",
  },
];

const ChooseAgentUI = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleAgentSelect = (agent: Agent) => {
    console.log("Selected agent:", agent);
    setSelectedAgent(agent);
  };

  const handleBackToAgentSelection = () => {
    setSelectedAgent(null);
  };

  // Show AgentDeployReview if an agent is selected
  if (selectedAgent) {
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
          <p className="text-lg text-gray-600">
            Select an AI agent to help you navigate the decentralized ecosystem
          </p>
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
                <AgentCard agent={agent} onSelect={handleAgentSelect} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChooseAgentUI;
