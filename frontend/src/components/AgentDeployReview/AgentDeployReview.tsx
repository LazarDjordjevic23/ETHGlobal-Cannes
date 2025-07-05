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

const getAgentDescription = (agent: Agent): string => {
  const descriptions: Record<string, string> = {
    Destructive:
      "A ruthless financial disruptor designed to aggressively optimize multi-chain treasury operations. This agent continuously hunts for inefficiencies in your DAO's ETHToken balances, systematically dismantling underperforming positions and reallocating capital to high-yield opportunities. It operates with zero tolerance for stagnant assets, constantly seeking to destroy poor investment decisions and rebuild stronger financial positions.",
    Capitalist:
      "A relentless profit maximization engine that evaluates and exploits available DeFi strategies with surgical precision. This agent investigates strategy contracts like a corporate raider, analyzing market conditions and extracting maximum value from every opportunity. It operates as your DAO's most aggressive investment arm, making cutthroat decisions to dominate yield generation and crush competition.",
    Comunism:
      "A collective intelligence synthesizer that democratizes insights from Destructive and Capitalist agents to create unified governance proposals. This agent operates on consensus-driven principles, ensuring all treasury decisions benefit the collective good while maintaining strategic aggression. It serves as the people's representative, translating ruthless financial strategies into actionable community-approved proposals.",
  };
  return descriptions[agent.name.split(" ")[0]] || agent.description;
};

const getAgentCapabilities = (agent: Agent): string[] => {
  const capabilities: Record<string, string[]> = {
    Destructive: [
      "Aggressive multi-chain treasury liquidation",
      "Systematic underperformer elimination",
      "Ruthless capital reallocation protocols",
      "Zero-tolerance inefficiency detection",
      "Destructive portfolio reconstruction",
      "Merciless asset optimization scoring",
    ],
    Capitalist: [
      "Corporate raider-style strategy analysis",
      "Monopolistic market domination forecasting",
      "Maximum profit extraction calculation",
      "Competitive advantage identification",
      "Ruthless performance optimization",
      "Cutthroat investment recommendation generation",
    ],
    Comunism: [
      "Collective intelligence synthesis",
      "Democratic proposal creation and formatting",
      "Community-driven execution calldata generation",
      "Consensus-based decision documentation",
      "Collective governance lifecycle management",
      "Proletariat interest protection protocols",
    ],
  };

  return (
    capabilities[agent.name.split(" ")[0]] || [
      "Advanced AI-powered decision making",
      "Automated governance operations",
      "Multi-chain coordination",
    ]
  );
};

const getAgentDecisionFramework = (agent: Agent): string => {
  const frameworks: Record<string, string> = {
    Destructive:
      "Employs a scorched-earth approach focusing on asset liquidation velocity, position elimination ratios, and opportunity destruction analysis. Prioritizes actions that aggressively dismantle underperforming investments while maintaining zero tolerance for inefficiency through systematic portfolio demolition.",
    Capitalist:
      "Utilizes a predatory profit maximization framework, evaluating strategies based on market exploitation potential, competitive destruction capacity, and monopolistic advantage accumulation. Applies corporate raider principles to recommend aggressive wealth concentration approaches.",
    Comunism:
      "Implements a collective consensus synthesis model, weighing recommendations from Destructive and Capitalist agents against community ownership principles and collective benefit maximization. Ensures proposals serve the proletariat while maintaining revolutionary strategic aggression.",
  };
  return (
    frameworks[agent.name.split(" ")[0]] ||
    "Advanced decision-making framework combining quantitative analysis with governance best practices to optimize DAO operations."
  );
};

const getAgentWorkflow = (
  agent: Agent
): { title: string; description: string }[] => {
  const workflows: Record<string, { title: string; description: string }[]> = {
    Destructive: [
      {
        title: "Hunt",
        description:
          "Ruthlessly track and identify underperforming ETHToken positions across all treasury contracts",
      },
      {
        title: "Destroy",
        description:
          "Systematically eliminate inefficient investments and liquidate stagnant assets",
      },
      {
        title: "Reconstruct",
        description:
          "Provide aggressive portfolio reconstruction insights to the Comunism Agent",
      },
    ],
    Capitalist: [
      {
        title: "Exploit",
        description:
          "Identify and analyze high-profit strategy contracts for maximum extraction",
      },
      {
        title: "Dominate",
        description:
          "Calculate monopolistic advantages and market domination potential",
      },
      {
        title: "Conquer",
        description:
          "Provide ruthless profit maximization strategies to the Comunism Agent",
      },
    ],
    Comunism: [
      {
        title: "Collectivize",
        description:
          "Synthesize insights from Destructive and Capitalist agents for collective benefit",
      },
      {
        title: "Democratize",
        description:
          "Draft community-approved governance proposals with execution calldata",
      },
      {
        title: "Revolutionize",
        description:
          "Manage collective proposal lifecycle and ensure proletariat interests",
      },
    ],
  };
  return (
    workflows[agent.name.split(" ")[0]] || [
      {
        title: "Analyze",
        description: "Process on-chain data and market conditions",
      },
      {
        title: "Decide",
        description: "Make strategic decisions based on programmed logic",
      },
      {
        title: "Execute",
        description: "Implement decisions through governance proposals",
      },
    ]
  );
};

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

    for (let i = 0; i < deploymentSteps.length; i++) {
      setCurrentStep(i);
      await wait(2000);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Selected Agent
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Identity */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {selectedAgent.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-gray-600 text-sm">Autonomous AI Agent</p>
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
            </div>

            {/* Agent Description & Capabilities */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Overview
                  </h4>
                  {/* <p className="text-gray-700 leading-relaxed">
                    {getAgentDescription(selectedAgent)}
                  </p> */}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Core Capabilities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getAgentCapabilities(selectedAgent).map(
                      (capability, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            {capability}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Decision Framework
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-700">
                      {getAgentDecisionFramework(selectedAgent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Workflow */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Agent Workflow
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getAgentWorkflow(selectedAgent).map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {step.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < getAgentWorkflow(selectedAgent).length - 1 && (
                    <div className="hidden md:block absolute top-4 -right-2 w-4 h-0.5 bg-gray-300"></div>
                  )}
                </div>
              ))}
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
