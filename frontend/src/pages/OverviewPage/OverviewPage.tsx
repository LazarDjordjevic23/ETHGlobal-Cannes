import { motion } from "framer-motion";
import TreasuryDashboard from "../../components/Dashboard/TreasuryDashboard";
import DAOTokenMetricsDashboard from "../../components/Dashboard/DAOTokenMetricsDashboard";
import { Tabs, type TabItem } from "../../components/Tabs";

const OverviewPage = () => {
  const tabs: TabItem[] = [
    {
      id: "treasury",
      label: "Treasury",
      icon: <span className="text-green-600">💰</span>,
      content: <TreasuryDashboard />,
    },
    {
      id: "dao",
      label: "DAO",
      icon: <span className="text-blue-600">🏛️</span>,
      content: <DAOTokenMetricsDashboard />,
    },
  ];

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DAO Overview
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analytics and insights for your DAO's treasury and
            governance tokens
          </p>
        </motion.div>

        {/* Tabbed Dashboards */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Tabs tabs={tabs} defaultTab="treasury" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewPage;
