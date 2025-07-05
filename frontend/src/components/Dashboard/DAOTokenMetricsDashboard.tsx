import Dashboard, {
  type DashboardMetric,
  type DashboardBreakdownItem,
} from "./Dashboard";

const DAOTokenMetricsDashboard = () => {
  // Mock data for DAO token metrics
  const tokenMetrics: DashboardMetric[] = [
    {
      label: "Current Token Price",
      value: "$0.85",
      change: {
        value: "+15.2%",
        trend: "up",
      },
      icon: <span className="text-green-600">📈</span>,
    },
    {
      label: "Circulating Supply",
      value: "12.5M",
      change: {
        value: "+2.1%",
        trend: "up",
      },
      icon: <span className="text-blue-600">🔄</span>,
    },
    {
      label: "Market Capitalization",
      value: "$10.6M",
      change: {
        value: "+17.8%",
        trend: "up",
      },
      icon: <span className="text-purple-600">💵</span>,
    },
    {
      label: "Total Supply",
      value: "100M",
      change: {
        value: "0%",
        trend: "neutral",
      },
      icon: <span className="text-gray-600">🎯</span>,
    },
    {
      label: "Burned Tokens",
      value: "2.3M",
      change: {
        value: "+0.8%",
        trend: "up",
      },
      icon: <span className="text-red-600">🔥</span>,
    },
    {
      label: "24h Volume",
      value: "$340K",
      change: {
        value: "+28.4%",
        trend: "up",
      },
      icon: <span className="text-orange-600">📊</span>,
    },
  ];

  // Mock data for token holder distribution
  const holderDistribution: DashboardBreakdownItem[] = [
    {
      label: "Top 10 Holders",
      value: "3.8M",
      percentage: 30.4,
      color: "#DC2626",
    },
    {
      label: "Top 100 Holders",
      value: "6.2M",
      percentage: 49.6,
      color: "#EA580C",
    },
    {
      label: "Community (1K+ holders)",
      value: "1.9M",
      percentage: 15.2,
      color: "#CA8A04",
    },
    {
      label: "Small Holders (<1K)",
      value: "0.6M",
      percentage: 4.8,
      color: "#16A34A",
    },
  ];

  const breakdowns = [
    {
      title: "Token Holder Distribution",
      items: holderDistribution,
    },
  ];

  return (
    <Dashboard
      title="DAO Token Metrics"
      description="Real-time metrics and distribution analysis for DAO governance tokens"
      metrics={tokenMetrics}
      breakdowns={breakdowns}
      className="mb-8"
    />
  );
};

export default DAOTokenMetricsDashboard;
