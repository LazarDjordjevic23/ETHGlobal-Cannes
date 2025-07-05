import { motion } from "framer-motion";
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="relative">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-600"
                }`}
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
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
