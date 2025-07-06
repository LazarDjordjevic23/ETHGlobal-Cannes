import DAOTokenMetricsDashboard from "./DAOTokenMetricsDashboard";
import TreasuryTokenMetricsDashboard from "./TreasuryTokenMetricsDashboard";
import TreasuryBalanceCard from "./TreasuryBalanceCard";

const DAOTreasuryDashboard = () => {
  return (
    <div>
      <DAOTokenMetricsDashboard />
      <TreasuryBalanceCard />
      <TreasuryTokenMetricsDashboard />
    </div>
  );
};

export default DAOTreasuryDashboard;
