import { useQuery } from "@tanstack/react-query";
import Dashboard, { type DashboardMetric } from "../Dashboard/Dashboard";
import { getDAOMetrics } from "@/utils/dao-queries";

const DAOTokenMetricsDashboard = () => {
  const { data: daoData, isLoading } = useQuery({
    queryKey: ["daoMetrics"],
    queryFn: getDAOMetrics,
  });

  const formatTotalSupply = () => {
    if (!daoData?.totalSupply || !daoData?.tokenSymbol) return "Loading...";
    return `${daoData.totalSupply.toLocaleString()} ${String(
      daoData.tokenSymbol
    )}`;
  };

  const tokenMetrics: DashboardMetric[] = [
    {
      label: "Token Name",
      value: daoData?.tokenName || "Loading...",
      change: undefined,
      icon: <span className="text-blue-600">🏷️</span>,
    },
    {
      label: "Token Symbol",
      value: daoData?.tokenSymbol ? String(daoData.tokenSymbol) : "Loading...",
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
      value: "$0.85",
      change: {
        value: "+2.1%",
        trend: "up",
      },
      icon: <span className="text-green-600">📈</span>,
    },
    {
      label: "Market Capitalization",
      value: daoData?.totalSupply
        ? `$${(daoData.totalSupply * 0.85).toLocaleString()}`
        : "Loading...",
      change: {
        value: "+2.1%",
        trend: "up",
      },
      icon: <span className="text-purple-600">💵</span>,
    },
    {
      label: "24h Volume",
      value: daoData?.totalSupply
        ? `$${Math.round(daoData.totalSupply * 0.85 * 0.15).toLocaleString()}`
        : "Loading...",
      change: {
        value: "+8.3%",
        trend: "up",
      },
      icon: <span className="text-orange-600">📊</span>,
    },
  ];

  return (
    <Dashboard
      title="DAO Token Metrics"
      description="Real-time metrics and distribution analysis for DAO governance tokens"
      metrics={tokenMetrics}
      loading={isLoading}
      className="mb-8"
    />
  );
};

export default DAOTokenMetricsDashboard;
