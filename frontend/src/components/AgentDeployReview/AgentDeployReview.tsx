import { motion } from "framer-motion";
import { useState } from "react";
import { evmNetworks } from "../../constants/chains";
import { useNavigate } from "react-router";
import { wait } from "@/utils/time";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  strategy: string;
}

interface AgentDeployReviewProps {
  selectedAgent: Agent;
  onBack: () => void;
}

const AgentDeployReview = ({
  selectedAgent,
  onBack,
}: AgentDeployReviewProps) => {
  const navigate = useNavigate();
  const [selectedChain, setSelectedChain] = useState<number>(
    evmNetworks[0].chainId
  );
  const [daoTokenName, setDaoTokenName] = useState("");
  const [daoTokenSymbol, setDaoTokenSymbol] = useState("");
  const [governanceName, setGovernanceName] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const deploymentSteps = [
    {
      title: "Deploying DAO Token",
      description: `Creating ${daoTokenName || "DAO Token"} (${
        daoTokenSymbol || "TOKEN"
      })`,
      icon: "🪙",
    },
    {
      title: "Setting up Governance",
      description: `Initializing ${governanceName || "DAO Governance"}`,
      icon: "⚖️",
    },
    {
      title: "Deploying Treasuries",
      description: "Creating multi-chain treasury contracts",
      icon: "🏦",
    },
    {
      title: "Configuring Agent",
      description: `Setting up ${selectedAgent.name}`,
      icon: "🤖",
    },
    {
      title: "Finalizing Setup",
      description: "Completing DAO configuration",
      icon: "✅",
    },
  ];

  const handleScrollToTop = async () => {
    await wait(300);
    window.scrollTo({ top: 0 });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeploying(true);
    setCurrentStep(0);

    // Simulate deployment steps
    for (let i = 0; i < deploymentSteps.length; i++) {
      setCurrentStep(i);
      await wait(2000); // Each step takes 2 second
    }

    setDeploying(false);
    navigate("/overview");
    handleScrollToTop();
  };

  return (
    <motion.div
      className="bg-gray-50 relative"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading Overlay */}
      {deploying && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Deploying Your DAO
              </h2>
              <p className="text-gray-600">
                Setting up your decentralized autonomous organization...
              </p>
            </div>

            <div className="space-y-4">
              {deploymentSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    index < currentStep
                      ? "bg-green-50 border border-green-200"
                      : index === currentStep
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 mr-3">
                    {index < currentStep ? (
                      <motion.div
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    ) : index === currentStep ? (
                      <motion.div
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <motion.div
                          className="w-3 h-3 bg-white rounded-full"
                          animate={{ scale: [1, 0.8, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </motion.div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg">
                        {step.icon}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        index <= currentStep ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        index <= currentStep ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(
                    ((currentStep + 1) / deploymentSteps.length) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((currentStep + 1) / deploymentSteps.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <motion.div
          className="mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <motion.button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              Back to Agent Selection
            </motion.button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure Your DAO
          </h1>
          <p className="text-lg text-gray-600">
            Set up your selected agent: {selectedAgent.name}
          </p>
        </motion.div>

        {/* Selected Agent Summary */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Selected Agent
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {selectedAgent.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAgent.name}
              </h3>
              <p className="text-gray-600">{selectedAgent.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedAgent.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {selectedAgent.strategy}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Configuration Options */}
        <motion.form
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            DAO Configuration
          </h2>
          <p className="text-gray-600 mb-6">
            Configure your DAO deployment settings and governance parameters.
          </p>

          <div className="space-y-6">
            {/* Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Chain
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedChain}
                onChange={(e) => setSelectedChain(Number(e.target.value))}
              >
                {evmNetworks.map((chain) => (
                  <option key={chain.chainId} value={chain.chainId}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DAO Token Configuration */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Deploy DAO Token
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MyDAO Token"
                    value={daoTokenName}
                    onChange={(e) => setDaoTokenName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Symbol
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MDAO"
                    value={daoTokenSymbol}
                    onChange={(e) => setDaoTokenSymbol(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Governance Contracts */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Deploy Governance Contracts
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Governance Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MyDAO Governance"
                  value={governanceName}
                  onChange={(e) => setGovernanceName(e.target.value)}
                />
              </div>
            </div>

            {/* Treasuries */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Deploy Treasuries
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Multi-Chain Deployment:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Treasuries will be deployed on all supported chains:
                </p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  {evmNetworks.map((chain) => (
                    <li key={chain.chainId} className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {chain.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: deploying ? 1 : 1.02 }}
              whileTap={{ scale: deploying ? 1 : 0.98 }}
              disabled={deploying}
            >
              {deploying ? "Deploying..." : "Deploy DAO"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AgentDeployReview;
