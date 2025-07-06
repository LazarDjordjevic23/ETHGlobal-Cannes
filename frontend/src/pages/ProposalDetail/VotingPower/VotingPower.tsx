import { motion } from "framer-motion";
import NumberDisplay from "@/components/NumberDisplay/NumberDisplay";
import { getVotesForUser } from "@/utils/dao-queries";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

const VotingPower = ({ totalSupply }: { totalSupply: number }) => {
  const { address } = useAccount();
  const { data: votingPower = 0, isLoading: isVotingPowerLoading } = useQuery({
    queryKey: ["votingPower", address],
    queryFn: () => getVotesForUser(address || ""),
    enabled: !!address,
  });

  const votingPowerPercentage = (votingPower / totalSupply) * 100;

  // No wallet connected state
  if (!address) {
    return (
      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Your Voting Power
        </h3>

        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="bg-gray-100 p-3 rounded-full inline-block mb-4">
              <span className="text-gray-400 text-2xl">🔗</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Wallet
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Connect your wallet to view your voting power and participate in
              governance.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Loading state
  if (isVotingPowerLoading) {
    return (
      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Your Voting Power
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-purple-600 text-xl">🗳️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available to vote</p>
              <p className="text-xs text-gray-500">
                Based on DAO token balance
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mb-1"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          </div>
        </div>

        {/* Loading Voting Power Visualization */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-600 font-medium">
                Your Voting Power
              </span>
              <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Voting Power Details */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Token Balance</span>
              <div className="animate-pulse bg-gray-200 h-5 w-20 rounded mt-1"></div>
            </div>
            <div>
              <span className="text-gray-600">Voting Status</span>
              <div className="animate-pulse bg-gray-200 h-5 w-16 rounded mt-1"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Your Voting Power
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <span className="text-purple-600 text-xl">🗳️</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Available to vote</p>
            <p className="text-xs text-gray-500">Based on DAO token balance</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            <NumberDisplay
              num={votingPower}
              decimals={0}
              formatOutputMethod={(num) => `${num}`}
            />
          </div>
          <div className="text-sm text-gray-500">
            {votingPowerPercentage.toFixed(2)}% of total
          </div>
        </div>
      </div>

      {/* Voting Power Visualization */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-purple-600 font-medium">
              Your Voting Power
            </span>
            <span className="text-gray-600">
              {votingPowerPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(votingPowerPercentage, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Voting Power Details */}
      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Token Balance</span>
            <div className="font-medium text-gray-900">
              <NumberDisplay
                num={votingPower}
                decimals={0}
                formatOutputMethod={(num) => `${num} DAO`}
              />
            </div>
          </div>
          <div>
            <span className="text-gray-600">Voting Status</span>
            <div className="font-medium text-green-600">Eligible</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VotingPower;
