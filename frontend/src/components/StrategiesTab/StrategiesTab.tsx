import { getStrategiesMetrics } from "@/utils/strategy-queries";
import { useQuery } from "@tanstack/react-query";
import Aave from "@/assets/svgs/aave.svg?react";
import Lido from "@/assets/svgs/lido.svg?react";
import Compound from "@/assets/svgs/compound.svg?react";
import NumberDisplay from "../NumberDisplay/NumberDisplay";

interface FormattedStrategyMetrics {
  apy: number;
  tvl: number;
  utilizationRate: number;
  riskAdjustedReturns: number;
  withdrawalLiquidity: number;
  description?: string;
}

const StrategiesTab = () => {
  const { data: strategiesMetrics, isLoading } = useQuery<
    FormattedStrategyMetrics[]
  >({
    queryKey: ["strategiesMetrics"],
    queryFn: getStrategiesMetrics,
  });

  const strategyNames = [
    {
      name: "Aave Protocol",
      icon: <Aave />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      name: "Lido Finance",
      icon: <Lido />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      name: "Compound Protocol",
      icon: <Compound />,
      color: "bg-green-50 border-green-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          📊 Investment Strategies Dashboard
        </h2>
        <p className="text-gray-600">
          Explore and analyze your DAO's investment strategies performance
          metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategiesMetrics?.map((strategy, index) => (
          <div
            key={index}
            className={`${strategyNames[index].color} rounded-xl p-6 border-2 hover:shadow-lg transition-shadow`}
          >
            {/* Strategy Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{strategyNames[index].icon}</span>
                {/* <h3 className="font-bold text-gray-900 text-lg">
                  {strategyNames[index].name}
                </h3> */}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-4">
              {/* APY */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📈</span>
                  <span className="text-sm font-medium text-gray-600">APY</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  <NumberDisplay
                    num={strategy.apy}
                    formatOutputMethod={(num) => `${num}%`}
                  />
                </span>
              </div>

              {/* TVL */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <span className="text-sm font-medium text-gray-600">TVL</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  <NumberDisplay
                    num={strategy.tvl / 1e6}
                    formatOutputMethod={(num) => `$${num}M`}
                  />
                </span>
              </div>

              {/* Utilization Rate */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-sm font-medium text-gray-600">
                    Utilization
                  </span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  <NumberDisplay
                    num={strategy.utilizationRate}
                    formatOutputMethod={(num) => `${num}%`}
                  />
                </span>
              </div>

              {/* Risk-Adjusted Returns */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm font-medium text-gray-600">
                    Sharpe Ratio
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  <NumberDisplay
                    num={strategy.riskAdjustedReturns}
                    formatOutputMethod={(num) => `${num}`}
                  />
                </span>
              </div>

              {/* Withdrawal Liquidity */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <span className="text-sm font-medium text-gray-600">
                    Liquidity
                  </span>
                </div>
                <span className="text-lg font-bold text-cyan-600">
                  <NumberDisplay
                    num={strategy.withdrawalLiquidity}
                    formatOutputMethod={(num) => `${num}%`}
                  />
                </span>
              </div>
            </div>

            {/* Description (only for first two strategies) */}
            {strategy.description && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📝</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {strategy.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600">💎</span>
            <span className="text-sm font-medium text-green-800">
              Total TVL
            </span>
          </div>
          <span className="text-2xl font-bold text-green-900">
            <NumberDisplay
              num={
                strategiesMetrics?.reduce((sum, strategy) => {
                  return sum + strategy.tvl / 1e6;
                }, 0) || 0
              }
              formatOutputMethod={(num) => `$${num}M`}
            />
          </span>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600">📊</span>
            <span className="text-sm font-medium text-blue-800">Avg APY</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">
            <NumberDisplay
              num={
                strategiesMetrics
                  ? strategiesMetrics.reduce((sum, strategy) => {
                      return sum + strategy.apy * 100;
                    }, 0) / strategiesMetrics.length
                  : 0
              }
              formatOutputMethod={(num) => `${num}%`}
            />
          </span>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-purple-600">🎲</span>
            <span className="text-sm font-medium text-purple-800">
              Avg Risk
            </span>
          </div>
          <span className="text-2xl font-bold text-purple-900">
            <NumberDisplay
              num={
                strategiesMetrics
                  ? strategiesMetrics.reduce((sum, strategy) => {
                      return sum + strategy.riskAdjustedReturns * 100;
                    }, 0) / strategiesMetrics.length
                  : 0
              }
              formatOutputMethod={(num) => `${num}`}
            />
          </span>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-600">🔥</span>
            <span className="text-sm font-medium text-orange-800">
              Strategies
            </span>
          </div>
          <span className="text-2xl font-bold text-orange-900">
            {strategiesMetrics?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StrategiesTab;
