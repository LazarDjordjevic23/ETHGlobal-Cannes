import Dashboard, {
  type DashboardMetric,
  type DashboardBreakdownItem,
} from "./Dashboard";

const TreasuryDashboard = () => {
  // Mock data for treasury metrics
  const treasuryMetrics: DashboardMetric[] = [
    {
      label: "Total Treasury Value",
      value: "$2.4M",
      change: {
        value: "+12.5%",
        trend: "up",
      },
      icon: <span className="text-green-600">💰</span>,
    },
    {
      label: "Liquid Assets",
      value: "$1.8M",
      change: {
        value: "+8.2%",
        trend: "up",
      },
      icon: <span className="text-blue-600">💧</span>,
    },
    {
      label: "Staked Assets",
      value: "$600K",
      change: {
        value: "+5.4%",
        trend: "up",
      },
      icon: <span className="text-purple-600">⚡</span>,
    },
  ];

  // Mock data for chain-specific balances
  const chainBalances: DashboardBreakdownItem[] = [
    {
      label: "Ethereum",
      value: "$1.2M",
      percentage: 50,
      color: "#627EEA",
    },
    {
      label: "Arbitrum",
      value: "$720K",
      percentage: 30,
      color: "#28A0F0",
    },
    {
      label: "Polygon",
      value: "$360K",
      percentage: 15,
      color: "#8247E5",
    },
    {
      label: "Optimism",
      value: "$120K",
      percentage: 5,
      color: "#FF0420",
    },
  ];

  // Mock data for asset composition
  const assetComposition: DashboardBreakdownItem[] = [
    {
      label: "DAO Tokens",
      value: "$960K",
      percentage: 40,
      color: "#10B981",
    },
    {
      label: "Stablecoins",
      value: "$720K",
      percentage: 30,
      color: "#6B7280",
    },
    {
      label: "LP Tokens",
      value: "$480K",
      percentage: 20,
      color: "#F59E0B",
    },
    {
      label: "Other Assets",
      value: "$240K",
      percentage: 10,
      color: "#EF4444",
    },
  ];

  const breakdowns = [
    {
      title: "Chain-Specific Balances",
      items: chainBalances,
    },
    {
      title: "Asset Composition",
      items: assetComposition,
    },
  ];

  return (
    <Dashboard
      title="Treasuries"
      description="Overview of DAO treasury holdings and distribution across chains and assets"
      metrics={treasuryMetrics}
      breakdowns={breakdowns}
      className="mb-8"
    />
  );
};

export default TreasuryDashboard;
