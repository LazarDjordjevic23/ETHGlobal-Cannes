import { useQuery } from "@tanstack/react-query";
import { getTreasuryETHTokenBalance } from "@/utils/dao-queries";
import NumberDisplay from "../NumberDisplay/NumberDisplay";

const TreasuryBalanceCard = () => {
  const { data: treasuryBalance, isLoading } = useQuery({
    queryKey: ["treasuryBalance"],
    queryFn: getTreasuryETHTokenBalance,
  });

  const formatTreasuryBalance = () => {
    if (!treasuryBalance) return "Loading...";
    return (
      <NumberDisplay
        num={treasuryBalance}
        decimals={2}
        formatOutputMethod={(num) => `${num} ETH`}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <span className="text-blue-600 text-xl">🏦</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Treasury Balance
            </h3>
            <p className="text-sm text-gray-600">
              Total ETH tokens held by the Treasury
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            ) : (
              formatTreasuryBalance()
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Available for strategies
          </div>
        </div>
      </div>

      {!isLoading && treasuryBalance && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Treasury Health</span>
            <span className="text-green-600 font-medium">
              {treasuryBalance > 1000
                ? "Excellent"
                : treasuryBalance > 100
                ? "Good"
                : "Low"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasuryBalanceCard;
