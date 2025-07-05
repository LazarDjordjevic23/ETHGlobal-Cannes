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
  loading?: boolean;
}

const Dashboard = ({
  title,
  description,
  metrics,
  breakdowns,
  className = "",
  loading = false,
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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <motion.div
      className={`relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header - Show actual title and description */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Breakdown Sections Skeleton */}
        {breakdowns && breakdowns.length > 0 && (
          <div className="space-y-6">
            {breakdowns.map((_, breakdownIndex) => (
              <motion.div
                key={breakdownIndex}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: breakdownIndex * 0.2, duration: 0.4 }}
              >
                <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded-lg w-12 animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cool shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Loading indicator */}
      <motion.div
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.4,
          }}
        />
        <span className="text-xs text-blue-600 font-medium">Loading</span>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + index * 10}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            delay: index * 0.3,
          }}
        />
      ))}
    </motion.div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

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
