import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface DashboardMetric {
  label: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
}

export interface DashboardBreakdownItem {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

export interface DashboardProps {
  title: string;
  description?: string;
  metrics: DashboardMetric[];
  breakdowns?: {
    title: string;
    items: DashboardBreakdownItem[];
  }[];
  className?: string;
}

const Dashboard = ({
  title,
  description,
  metrics,
  breakdowns,
  className = "",
}: DashboardProps) => {
  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {metric.icon}
                  <p className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                {metric.change && (
                  <div
                    className={`flex items-center gap-1 mt-1 ${getTrendColor(
                      metric.change.trend
                    )}`}
                  >
                    <span className="text-sm">
                      {getTrendIcon(metric.change.trend)}
                    </span>
                    <span className="text-sm font-medium">
                      {metric.change.value}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Breakdown Sections */}
        {breakdowns && breakdowns.length > 0 && (
          <div className="space-y-6">
            {breakdowns.map((breakdown, breakdownIndex) => (
              <motion.div
                key={breakdownIndex}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: breakdownIndex * 0.2, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {breakdown.title}
                </h3>
                <div className="space-y-3">
                  {breakdown.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
