import { motion } from "framer-motion";

interface ProposalHeaderProps {
  title: string;
  description: string;
  status: "pending" | "live" | "closed";
  createdBy: string;
  createdAt: string;
  endDate: string;
}

const ProposalHeader = ({
  title,
  description,
  status,
  createdBy,
  createdAt,
  endDate,
}: ProposalHeaderProps) => {
  const getStatusColor = (status: "pending" | "live" | "closed") => {
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

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            status
          )}`}
        >
          {status.toUpperCase()}
        </span>
        {createdBy === "AI Agent" && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            🤖 AI Generated
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
        <span>•</span>
        <span>Voting ends: {new Date(endDate).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
};

export default ProposalHeader;
