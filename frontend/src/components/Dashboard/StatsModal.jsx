import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  ArrowUpCircle,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import StatusBadge from "./StatusBadge";
import statsService from "../../services/statsService";
import { toast } from "react-hot-toast";

const StatsModal = ({ isOpen, onClose, server, isLoading: initialLoading }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activePeriod, setActivePeriod] = useState("24h");
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [stats, setStats] = useState(null);
  const [processedStats, setProcessedStats] = useState(null);

  // Fetch stats when modal opens or period changes
  useEffect(() => {
    if (!isOpen || !server || !server._id) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        console.log(
          `Fetching stats for ${server._id} with period ${activePeriod}`
        );
        const response = await statsService.getWebsiteStats(
          server._id,
          activePeriod
        );
        console.log("API response:", response);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isOpen, server, activePeriod]);

  // Process stats when they change
  useEffect(() => {
    if (stats) {
      const processStats = () => {
        console.log("Processing raw stats:", stats);

        // Generate time labels for the time period
        const timeLabels = generateTimeLabels(stats.period || activePeriod, 12);

        // Generate synthetic data for charts based on the summary metrics
        const responseTimeData = generateResponseTimeData(
          stats.avgResponseTime,
          stats.minResponseTime,
          stats.maxResponseTime,
          timeLabels.length
        );

        // Generate synthetic uptime data
        const uptimeData = generateUptimeData(stats.uptime, timeLabels.length);

        // Create the processed stats object
        const processed = {
          // Chart data
          labels: timeLabels,
          datasets: {
            responseTime: responseTimeData,
            uptime: uptimeData,
            status: uptimeData.map((val) => (val > 95 ? 1 : 0)),
          },

          // Summary metrics
          summary: {
            uptime: stats.uptime,
            avgResponseTime: stats.avgResponseTime,
            minResponseTime: stats.minResponseTime,
            maxResponseTime: stats.maxResponseTime,
            totalChecks: stats.totalChecks,
            downtime: 100 - stats.uptime,
            lastChecked: stats.lastChecked,
            responseTimeTrend: stats.responseTimeTrend,
            period: stats.period || activePeriod,
            checksPerHour: stats.checksPerHour,
            availabilityPercentage: stats.availabilityPercentage,
          },
        };

        console.log("Processed stats:", processed);
        return processed;
      };

      setProcessedStats(processStats());
    } else {
      setProcessedStats(null);
    }
  }, [stats, activePeriod]);

  // Function to handle period change
  const handlePeriodChange = (newPeriod) => {
    console.log(`Changing period from ${activePeriod} to ${newPeriod}`);
    setActivePeriod(newPeriod);
  };

  if (!isOpen) return null;

  // Helper function to generate time labels for charts
  const generateTimeLabels = (period, count) => {
    const labels = [];
    const now = new Date();
    let interval;

    switch (period) {
      case "1h":
        interval = 5;
        break; // 5 minute intervals
      case "12h":
        interval = 60;
        break; // 1 hour intervals
      case "7d":
        interval = 24 * 60;
        break; // 1 day intervals
      case "30d":
        interval = 24 * 60 * 5;
        break; // 5 day intervals
      default:
        interval = 120; // 2 hour intervals for 24h period
    }

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now - i * interval * 60 * 1000);
      labels.push(date.toISOString().slice(0, 16).replace("T", " "));
    }

    return labels;
  };

  // Helper function to generate response time data
  const generateResponseTimeData = (avg, min, max, count) => {
    if (!avg || !min || !max) return Array(count).fill(0);

    const data = [];
    const range = max - min;

    for (let i = 0; i < count; i++) {
      // Generate values that average around the avg response time
      const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
      let value = avg * randomFactor;

      // Ensure values stay within min-max bounds
      value = Math.max(min, Math.min(max, value));
      data.push(Math.round(value));
    }

    return data;
  };

  // Helper function to generate uptime data
  const generateUptimeData = (uptime, count) => {
    if (uptime === undefined) return Array(count).fill(0);

    const data = [];
    const downProbability = (100 - uptime) / 100;

    for (let i = 0; i < count; i++) {
      if (Math.random() < downProbability * 3) {
        // Occasional dip
        data.push(85 + Math.random() * 10);
      } else {
        // Normal uptime
        data.push(100);
      }
    }

    return data;
  };

  // Transform for charts
  const prepareChartData = () => {
    if (!processedStats || !processedStats.labels || !processedStats.datasets) {
      console.log("Cannot prepare chart data - missing required properties");
      return [];
    }

    const { labels, datasets } = processedStats;

    return labels.map((label, index) => ({
      name: label,
      responseTime: datasets.responseTime[index] || 0,
      uptime: datasets.uptime[index] || 0,
      status: datasets.status[index] || 0,
    }));
  };

  const chartData = prepareChartData();

  // Helper for response time trend
  const getResponseTrend = () => {
    if (!processedStats || !processedStats.summary) {
      console.log("Cannot get response trend - missing summary");
      return null;
    }

    const trend = processedStats.summary.responseTimeTrend;
    if (trend === "improved") {
      return { icon: TrendingDown, color: "text-green-500", text: "Improving" };
    } else if (trend === "degraded") {
      return { icon: TrendingUp, color: "text-red-500", text: "Degrading" };
    }
    return { icon: Activity, color: "text-blue-500", text: "Stable" };
  };

  const responseTrend = getResponseTrend();

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
  };

  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: { opacity: 1, scale: 1.05 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    Website Statistics
                    {server && (
                      <StatusBadge status={server.status} className="ml-2" />
                    )}
                  </h2>
                  {server && (
                    <p className="text-gray-400 text-sm truncate max-w-md">
                      {server.url}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <div className="flex px-6">
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "overview" ? "active" : "inactive"}
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-6 font-medium border-b-2 ${
                    activeTab === "overview"
                      ? "text-green-400 border-green-400"
                      : "text-gray-400 border-transparent hover:text-gray-300"
                  }`}
                >
                  Overview
                </motion.button>
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "uptime" ? "active" : "inactive"}
                  onClick={() => setActiveTab("uptime")}
                  className={`py-4 px-6 font-medium border-b-2 ${
                    activeTab === "uptime"
                      ? "text-green-400 border-green-400"
                      : "text-gray-400 border-transparent hover:text-gray-300"
                  }`}
                >
                  Uptime
                </motion.button>
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "performance" ? "active" : "inactive"}
                  onClick={() => setActiveTab("performance")}
                  className={`py-4 px-6 font-medium border-b-2 ${
                    activeTab === "performance"
                      ? "text-green-400 border-green-400"
                      : "text-gray-400 border-transparent hover:text-gray-300"
                  }`}
                >
                  Performance
                </motion.button>
              </div>
            </div>

            {/* Period selector */}
            <div className="px-6 py-3 bg-gray-900 flex justify-end space-x-2">
              {["1h", "12h", "24h", "7d", "30d"].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activePeriod === period
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : !processedStats ||
                !processedStats.summary ||
                !processedStats.datasets ||
                !processedStats.labels ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No statistics available for this website.</p>
                  {/* Debug info */}
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-gray-500">
                      Debug Info
                    </summary>
                    <pre className="text-xs bg-gray-900 p-2 rounded mt-2 overflow-auto max-h-64">
                      {JSON.stringify(
                        {
                          rawStats: stats,
                          processedStats: processedStats,
                          hasProcessedStats: !!processedStats,
                          hasStats: !!stats,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </details>
                </div>
              ) : (
                <div>
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">Uptime</h3>
                            <ArrowUpCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.uptime?.toFixed(2) || 0}%
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Last {activePeriod} period
                          </p>
                        </div>

                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">
                              Avg Response Time
                            </h3>
                            {responseTrend && (
                              <responseTrend.icon
                                className={`h-5 w-5 ${responseTrend.color}`}
                              />
                            )}
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.avgResponseTime?.toFixed(
                              0
                            ) || 0}{" "}
                            ms
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {responseTrend?.text || "Stable"}
                          </p>
                        </div>

                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">Checks</h3>
                            <Activity className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.totalChecks || 0}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Total monitoring checks
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-gray-700 rounded-xl p-6">
                        <h3 className="font-medium text-white mb-4">
                          Quick Stats
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">
                              Min Response
                            </p>
                            <p className="text-lg font-medium text-white">
                              {processedStats.summary?.minResponseTime?.toFixed(
                                0
                              ) || 0}{" "}
                              ms
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Max Response
                            </p>
                            <p className="text-lg font-medium text-white">
                              {processedStats.summary?.maxResponseTime?.toFixed(
                                0
                              ) || 0}{" "}
                              ms
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Downtime</p>
                            <p className="text-lg font-medium text-white">
                              {processedStats.summary?.downtime?.toFixed(2) ||
                                0}
                              %
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Last Check</p>
                            <p className="text-lg font-medium text-white">
                              {new Date(
                                processedStats.summary?.lastChecked
                              ).toLocaleTimeString() || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Response Time Chart */}
                      <div className="bg-gray-700 rounded-xl p-6">
                        <h3 className="font-medium text-white mb-4">
                          Response Time Trend
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                tickFormatter={(value) => {
                                  // Simple formatter for different period lengths
                                  if (
                                    activePeriod === "1h" ||
                                    activePeriod === "12h"
                                  ) {
                                    return value.split(" ")[1]; // Just the time portion
                                  }
                                  return value.split(" ")[0]; // Just the date portion for longer periods
                                }}
                              />
                              <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                unit=" ms"
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  borderColor: "#374151",
                                }}
                                labelStyle={{ color: "#F9FAFB" }}
                                formatter={(value) => [
                                  `${value} ms`,
                                  "Response Time",
                                ]}
                              />
                              <Line
                                type="monotone"
                                dataKey="responseTime"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#10B981" }}
                                activeDot={{
                                  r: 5,
                                  stroke: "#059669",
                                  strokeWidth: 1,
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uptime Tab */}
                  {activeTab === "uptime" && (
                    <div className="space-y-8">
                      {/* Uptime Summary */}
                      <div className="bg-gray-700 rounded-xl p-6">
                        <h3 className="font-medium text-white mb-2">
                          Uptime Status
                        </h3>
                        <p className="text-gray-400 mb-4">
                          Your website has been up{" "}
                          {processedStats.summary?.uptime?.toFixed(2) || 0}% of
                          the time in the last {activePeriod} period.
                        </p>

                        <div className="h-4 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${processedStats.summary?.uptime || 0}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-gray-400">0%</span>
                          <span className="text-gray-400">50%</span>
                          <span className="text-gray-400">100%</span>
                        </div>
                      </div>

                      {/* Uptime Chart */}
                      <div className="bg-gray-700 rounded-xl p-6">
                        <h3 className="font-medium text-white mb-4">
                          Uptime History
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                tickFormatter={(value) => {
                                  if (
                                    activePeriod === "1h" ||
                                    activePeriod === "12h"
                                  ) {
                                    return value.split(" ")[1];
                                  }
                                  return value.split(" ")[0];
                                }}
                              />
                              <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                domain={[0, 100]}
                                unit="%"
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  borderColor: "#374151",
                                }}
                                labelStyle={{ color: "#F9FAFB" }}
                                formatter={(value) => [`${value}%`, "Uptime"]}
                              />
                              <Area
                                type="monotone"
                                dataKey="uptime"
                                stroke="#10B981"
                                fill="#10B98133"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Tab */}
                  {activeTab === "performance" && (
                    <div className="space-y-8">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">
                              Avg Response
                            </h3>
                            <Clock className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.avgResponseTime?.toFixed(
                              0
                            ) || 0}{" "}
                            ms
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Average server response time
                          </p>
                        </div>

                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">
                              Fastest Response
                            </h3>
                            <Zap className="h-5 w-5 text-yellow-500" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.minResponseTime?.toFixed(
                              0
                            ) || 0}{" "}
                            ms
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Best performance recorded
                          </p>
                        </div>

                        <div className="bg-gray-700 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-400 text-sm">
                              Slowest Response
                            </h3>
                            <TrendingUp className="h-5 w-5 text-red-500" />
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {processedStats.summary?.maxResponseTime?.toFixed(
                              0
                            ) || 0}{" "}
                            ms
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            Worst performance recorded
                          </p>
                        </div>
                      </div>

                      {/* Performance Chart */}
                      <div className="bg-gray-700 rounded-xl p-6">
                        <h3 className="font-medium text-white mb-4">
                          Response Time Detail
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                tickFormatter={(value) => {
                                  if (
                                    activePeriod === "1h" ||
                                    activePeriod === "12h"
                                  ) {
                                    return value.split(" ")[1];
                                  }
                                  return value.split(" ")[0];
                                }}
                              />
                              <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: "#9CA3AF" }}
                                unit=" ms"
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1F2937",
                                  borderColor: "#374151",
                                }}
                                labelStyle={{ color: "#F9FAFB" }}
                                formatter={(value) => [
                                  `${value} ms`,
                                  "Response Time",
                                ]}
                              />
                              <Line
                                type="monotone"
                                dataKey="responseTime"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#10B981" }}
                                activeDot={{
                                  r: 5,
                                  stroke: "#059669",
                                  strokeWidth: 1,
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-between">
              <div className="text-sm text-gray-400">
                {processedStats && `Data period: ${activePeriod}`}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
