import { useQuery } from "@tanstack/react-query";
import Dashboard, { type DashboardMetric } from "../Dashboard/Dashboard";
import { getETHTokenMetrics } from "@/utils/dao-queries";

const TreasuryTokenMetricsDashboard = () => {
  const { data: ethTokenData, isLoading } = useQuery({
    queryKey: ["ethTokenMetrics"],
    queryFn: getETHTokenMetrics,
  });

  const formatTotalSupply = () => {
    if (!ethTokenData?.totalSupply || !ethTokenData?.tokenSymbol)
      return "Loading...";
    return `${ethTokenData.totalSupply.toLocaleString()} ${String(
      ethTokenData.tokenSymbol
    )}`;
  };

  const tokenMetrics: DashboardMetric[] = [
    {
      label: "Token Name",
      value: ethTokenData?.tokenName || "Loading...",
      change: undefined,
      icon: <span className="text-blue-600">🏷️</span>,
    },
    {
      label: "Token Symbol",
      value: ethTokenData?.tokenSymbol
        ? String(ethTokenData.tokenSymbol)
        : "Loading...",
      change: undefined,
      icon: <span className="text-purple-600">💎</span>,
    },
    {
      label: "Total Supply",
      value: formatTotalSupply(),
      change: {
        value: "Fixed",
        trend: "neutral",
      },
      icon: <span className="text-gray-600">🎯</span>,
    },
    {
      label: "Current Token Price",
      value: "$1.00",
      change: {
        value: "+0.1%",
        trend: "up",
      },
      icon: <span className="text-green-600">📈</span>,
    },
    {
      label: "Market Capitalization",
      value: ethTokenData?.totalSupply
        ? `$${(ethTokenData.totalSupply * 1.0).toLocaleString()}`
        : "Loading...",
      change: {
        value: "+0.1%",
        trend: "up",
      },
      icon: <span className="text-purple-600">💵</span>,
    },
    {
      label: "24h Volume",
      value: ethTokenData?.totalSupply
        ? `$${Math.round(
            ethTokenData.totalSupply * 1.0 * 0.08
          ).toLocaleString()}`
        : "Loading...",
      change: {
        value: "+5.2%",
        trend: "up",
      },
      icon: <span className="text-orange-600">📊</span>,
    },
  ];

  return (
    <Dashboard
      title="Treasury Token Metrics"
      description="Real-time metrics and analysis for treasury ETH tokens"
      metrics={tokenMetrics}
      loading={isLoading}
      className="mb-8"
    />
  );
};

export default TreasuryTokenMetricsDashboard;
