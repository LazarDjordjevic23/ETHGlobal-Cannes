import { motion } from "framer-motion";
import { Tabs, type TabItem } from "../../components/Tabs";
import ProposalsList from "../../components/Proposals/ProposalsList";
import RequestProposal from "../../components/Proposals/RequestProposal";

const GovernancePage = () => {
  const tabs: TabItem[] = [
    {
      id: "proposals",
      label: "Proposals List",
      icon: <span className="text-blue-600">📋</span>,
      content: <ProposalsList />,
    },
    {
      id: "request",
      label: "Request Proposal",
      icon: <span className="text-green-600">🤖</span>,
      content: <RequestProposal />,
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
            DAO Governance
          </h1>
          <p className="text-lg text-gray-600">
            Participate in governance decisions and request new proposals from
            your AI agent
          </p>
        </motion.div>

        {/* Tabbed Interface */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Tabs tabs={tabs} defaultTab="proposals" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GovernancePage;
