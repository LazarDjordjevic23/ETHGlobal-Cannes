import DAOTokenMetricsDashboard from "./DAOTokenMetricsDashboard";
import TreasuryTokenMetricsDashboard from "./TreasuryTokenMetricsDashboard";

const DAOTreasuryDashboard = () => {
  return (
    <div>
      <DAOTokenMetricsDashboard />
      <TreasuryTokenMetricsDashboard />
    </div>
  );
};

export default DAOTreasuryDashboard;
