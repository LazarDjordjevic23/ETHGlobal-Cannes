import Dashboard, { type DashboardMetric } from "./Dashboard";

const TreasuryMetricsDashboard = () => {
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

  return (
    <Dashboard
      title="Treasuries"
      description="Overview of DAO treasury holdings and distribution across chains and assets"
      metrics={treasuryMetrics}
      className="mb-8"
    />
  );
};

export default TreasuryMetricsDashboard;
