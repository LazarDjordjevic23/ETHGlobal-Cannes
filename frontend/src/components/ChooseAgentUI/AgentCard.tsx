import { motion } from "framer-motion";

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  strategy: string;
  risk: string;
}

interface AgentCardProps {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
}

const AgentCard = ({ agent, onSelect }: AgentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "sharing":
        return "bg-green-100 text-green-800";
      case "distracted":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "pumping":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
      case "collective":
        return "bg-green-100 text-green-800";
      case "medium":
      case "chaotic":
        return "bg-yellow-100 text-yellow-800";
      case "high":
      case "yolo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(agent);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer group"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      layout
      layoutId={`agent-card-${agent.id}`}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.3,
      }}
    >
      <div className="p-6">
        {/* Agent Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3
              className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors"
              layoutId={`agent-name-${agent.id}`}
            >
              {agent.name}
            </motion.h3>
            <div className="flex items-center space-x-2">
              <motion.span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  agent.status
                )}`}
                layoutId={`agent-status-${agent.id}`}
              >
                {agent.status}
              </motion.span>
              <motion.span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                  agent.risk
                )}`}
                layoutId={`agent-risk-${agent.id}`}
              >
                {agent.risk} Risk
              </motion.span>
            </div>
          </div>
          <motion.div className="ml-4" layoutId={`agent-avatar-${agent.id}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {agent.name.charAt(0)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-sm mb-4 line-clamp-3"
          layoutId={`agent-description-${agent.id}`}
        >
          {agent.description}
        </motion.p>

        {/* Strategy */}
        <motion.div className="mb-4" layoutId={`agent-strategy-${agent.id}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Strategy</span>
            <span className="text-sm font-bold text-purple-600">MAX 💯</span>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-800">
              {agent.strategy}
            </span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 group-hover:bg-blue-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Select Agent
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AgentCard;
