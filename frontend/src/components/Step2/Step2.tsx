import { motion } from "framer-motion";
import { useState } from "react";
import { evmNetworks } from "../../constants/chains";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  strategy: string;
  risk: string;
}

interface Step2Props {
  selectedAgent: Agent;
  onBack: () => void;
}

const Step2 = ({ selectedAgent, onBack }: Step2Props) => {
  const [riskLevel, setRiskLevel] = useState(selectedAgent.risk.toLowerCase());
  const [selectedChain, setSelectedChain] = useState<number>(
    evmNetworks[0].chainId
  );
  const [daoTokenName, setDaoTokenName] = useState("");
  const [daoTokenSymbol, setDaoTokenSymbol] = useState("");
  const [governanceName, setGovernanceName] = useState("");

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
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
            Configure Your Agent
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
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
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

            {/* Risk Level */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="yolo">YOLO</option>
              </select>
            </div>

            <motion.button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Deploy DAO & Agent
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step2;
