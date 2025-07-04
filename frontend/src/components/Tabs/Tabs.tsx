import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  className?: string;
  defaultTab?: string;
}

const Tabs = ({ tabs, className = "", defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="relative">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                whileHover={{
                  scale: 1.02,
                  backgroundColor:
                    activeTab === tab.id
                      ? "rgba(219, 234, 254, 0.7)"
                      : "rgba(249, 250, 251, 1)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                style={{
                  transition:
                    "550ms linear(0, 0.1719, 0.4986, 0.7952, 0.9887, 1.0779, 1.0939, 1.0726, 1.0412, 1.0148, 0.9986, 0.9919, 0.9913, 0.9937, 0.9967, 0.999, 1.0003, 1)",
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>

                {/* Active Tab Indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: -10 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {activeTabContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
