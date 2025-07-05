import { motion } from "framer-motion";

interface VotingResultsProps {
  votes: {
    for: number;
    against: number;
    abstain: number;
    total: number;
  };
  quorum: number;
}

const VotingResults = ({ votes, quorum }: VotingResultsProps) => {
  const getVotePercentage = (voteCount: number) => {
    return votes.total > 0 ? (voteCount / votes.total) * 100 : 0;
  };

  const isQuorumMet = votes.total >= quorum;

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Voting Results</h3>

      {/* Vote Bars */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-600 font-medium">For</span>
            <span className="text-gray-600">
              {votes.for} ({getVotePercentage(votes.for).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${getVotePercentage(votes.for)}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-600 font-medium">Against</span>
            <span className="text-gray-600">
              {votes.against} ({getVotePercentage(votes.against).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${getVotePercentage(votes.against)}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Abstain</span>
            <span className="text-gray-600">
              {votes.abstain} ({getVotePercentage(votes.abstain).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${getVotePercentage(votes.abstain)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quorum Status */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Quorum ({quorum} required)</span>
          <span
            className={`font-medium ${
              isQuorumMet ? "text-green-600" : "text-red-600"
            }`}
          >
            {isQuorumMet ? "Met" : "Not Met"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isQuorumMet ? "bg-green-600" : "bg-orange-500"
            }`}
            style={{
              width: `${Math.min((votes.total / quorum) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {votes.total} / {quorum} votes
        </div>
      </div>
    </motion.div>
  );
};

export default VotingResults;
