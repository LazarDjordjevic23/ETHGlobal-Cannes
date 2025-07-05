import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface CastVoteProps {
  proposalStatus: "pending" | "live" | "closed";
}

const CastVote = ({ proposalStatus }: CastVoteProps) => {
  const [selectedVote, setSelectedVote] = useState<
    "for" | "against" | "abstain" | null
  >(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();

  const handleVote = (vote: "for" | "against" | "abstain") => {
    setSelectedVote(vote);
    setHasVoted(true);
  };

  if (proposalStatus !== "live") {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 relative overflow-hidden"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Cast Your Vote</h3>

      {/* Voting Content */}
      <div
        className={`${
          !isConnected ? "blur-sm" : ""
        } transition-all duration-300`}
      >
        {!hasVoted ? (
          <div className="space-y-3">
            <button
              onClick={() => handleVote("for")}
              disabled={!isConnected}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote("against")}
              disabled={!isConnected}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Vote Against
            </button>
            <button
              onClick={() => handleVote("abstain")}
              disabled={!isConnected}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Abstain
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <p className="text-gray-900 font-medium">Vote Cast!</p>
            <p className="text-sm text-gray-600">You voted: {selectedVote}</p>
          </div>
        )}
      </div>

      {/* Connect Wallet Overlay */}
      {!isConnected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h4>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Connect your wallet to participate in governance and cast your
              vote
            </p>
            <motion.button
              onClick={() => setShowAuthFlow(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect Wallet
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CastVote;
