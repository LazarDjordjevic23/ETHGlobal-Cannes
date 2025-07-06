import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWalletClient } from "wagmi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  castVote,
  executeProposalCreation,
} from "../../../utils/proposal-queries";
import { toast } from "sonner";
import type { AvailableChainId } from "@/constants/chains";

interface CastVoteProps {
  proposalStatus: "pending" | "live" | "closed";
  proposalId?: string;
}

const CastVote = ({ proposalStatus, proposalId }: CastVoteProps) => {
  const [selectedVote, setSelectedVote] = useState<
    "for" | "against" | "abstain" | null
  >(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();

  // Vote options mapping
  const voteOptions = [
    {
      key: "for" as const,
      label: "Vote For",
      value: 1,
      icon: "✓",
      color: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      description: "Support this proposal",
    },
    {
      key: "against" as const,
      label: "Vote Against",
      value: 0,
      icon: "✗",
      color: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      description: "Oppose this proposal",
    },
    {
      key: "abstain" as const,
      label: "Abstain",
      value: 2,
      icon: "~",
      color: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      description: "Neutral on this proposal",
    },
  ];

  const voteMutation = useMutation({
    mutationFn: async (vote: "for" | "against" | "abstain") => {
      if (!walletClient || !proposalId) {
        throw new Error("Wallet not connected or proposal ID missing");
      }

      const voteValue = voteOptions.find((v) => v.key === vote)?.value;
      if (voteValue === undefined) {
        throw new Error("Invalid vote option");
      }

      const tx = await castVote(
        proposalId,
        voteValue as 0 | 1 | 2,
        walletClient
      );

      let secondsPassed = 0;
      const intervalId = setInterval(() => {
        secondsPassed++;
        console.log(
          `Seconds passed: ${secondsPassed}/180 - Waiting for proposal execution...`
        );
      }, 1000);

      setTimeout(async () => {
        clearInterval(intervalId);
        console.log("3 minutes elapsed - Executing proposal creation...");
        const result = await executeProposalCreation({
          chainId: walletClient.chain.id as AvailableChainId,
        });
        console.log({ result });
      }, 3 * 60 * 1000);

      return { tx, vote };
    },
    onSuccess: (data) => {
      toast.success(`Vote cast successfully! Transaction: ${data.tx}`);
      setHasVoted(true);
      setSelectedVote(data.vote);
      // Invalidate and refetch proposal votes
      queryClient.invalidateQueries({
        queryKey: ["proposal-votes", proposalId],
      });
    },
    onError: (error) => {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote. Please try again.");
      setSelectedVote(null);
    },
  });

  const handleVote = (vote: "for" | "against" | "abstain") => {
    setSelectedVote(vote);

    voteMutation.mutate(vote);
  };

  if (proposalStatus !== "live") {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 relative overflow-hidden"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
          <span className="text-white text-xl">🗳️</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cast Your Vote</h3>
          <p className="text-sm text-gray-600">
            Make your voice heard in governance
          </p>
        </div>
      </div>

      {/* Voting Content */}
      <div
        className={`${
          !isConnected ? "blur-sm" : ""
        } transition-all duration-300`}
      >
        {!hasVoted ? (
          <div className="space-y-4">
            {voteOptions.map((option) => (
              <motion.button
                key={option.key}
                onClick={() => handleVote(option.key)}
                disabled={!isConnected || voteMutation.isPending}
                className={`w-full ${option.color} text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-md hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm opacity-90">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {voteMutation.isPending && selectedVote === option.key && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="text-green-600 text-4xl">✓</div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Vote Cast Successfully!
            </h4>
            <p className="text-gray-600 mb-4">
              Your vote has been recorded on the blockchain
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm font-medium text-gray-900">
                You voted:{" "}
                <span className="text-green-600 font-bold capitalize">
                  {selectedVote}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This vote is now part of the permanent record
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Connect Wallet Overlay */}
      {!isConnected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-indigo-50/95 to-purple-50/95 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <svg
                className="w-10 h-10 text-white"
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
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Connect Your Wallet
            </h4>
            <p className="text-gray-600 mb-6 max-w-xs mx-auto">
              Connect your wallet to participate in governance and make your
              voice heard
            </p>
            <motion.button
              onClick={() => setShowAuthFlow(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
