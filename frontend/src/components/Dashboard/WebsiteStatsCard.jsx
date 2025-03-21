import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp } from "lucide-react";

const WebsiteStatsCard = ({ stats, period = "24h", isLoading = false }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg h-40 flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </motion.div>
    );
  }

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg h-40 flex items-center justify-center"
      >
        <p className="text-gray-400 text-center">No statistics available</p>
      </motion.div>
    );
  }

  // Create chart data
  const chartData =
    stats.datasets?.responseTime.map((value, index) => ({
      name: stats.labels[index],
      value,
    })) || [];

  const uptimePercentage = stats.summary?.uptime || 0;
  const avgResponseTime = stats.summary?.avgResponseTime || 0;
  const responseTimeTrend = stats.summary?.responseTimeTrend || "stable";

  // Determine trend indicator
  const getTrendIndicator = () => {
    if (responseTimeTrend === "improved") {
      return {
        icon: ArrowDownRight,
        color: "text-green-500",
        text: "Improved",
        bgColor: "bg-green-500/20",
      };
    } else if (responseTimeTrend === "degraded") {
      return {
        icon: ArrowUpRight,
        color: "text-red-500",
        text: "Degraded",
        bgColor: "bg-red-500/20",
      };
    }
    return {
      icon: TrendingUp,
      color: "text-blue-500",
      text: "Stable",
      bgColor: "bg-blue-500/20",
    };
  };

  const { icon: TrendIcon, color, text, bgColor } = getTrendIndicator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Website Performance</h3>
        <div className="text-gray-400 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{period}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Uptime</p>
          <p className="text-2xl font-bold text-white">
            {uptimePercentage.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Response Time</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-white mr-2">
              {avgResponseTime.toFixed(0)} ms
            </p>
            <div className={`p-1 rounded-full ${bgColor}`}>
              <TrendIcon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Mini chart for response time */}
      <div className="h-20 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WebsiteStatsCard;
