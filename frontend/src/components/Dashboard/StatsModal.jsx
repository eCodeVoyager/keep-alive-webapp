import React, { useState } from "react";
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

const StatsModal = ({ isOpen, onClose, server, stats, isLoading }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activePeriod, setActivePeriod] = useState("24h");

  if (!isOpen) return null;

  // Transform data for charts
  const prepareChartData = () => {
    if (!stats || !stats.datasets) return [];

    const { labels, datasets } = stats;

    return labels.map((label, index) => ({
      name: label,
      responseTime: datasets.responseTime[index] || 0,
      uptime: datasets.uptime[index] || 0,
      status: datasets.status[index] || 0,
    }));
  };

  const chartData = prepareChartData();

  // Helper to format uptime
  const formatUptime = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Helper for response time trend
  const getResponseTrend = () => {
    if (!stats || !stats.summary) return null;

    const trend = stats.summary.responseTimeTrend;
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
                  onClick={() => setActivePeriod(period)}
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
              ) : !stats ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No statistics available for this website.</p>
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
                            {stats.summary?.uptime?.toFixed(2) || 0}%
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
                            {stats.summary?.avgResponseTime?.toFixed(0) || 0} ms
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
                            {stats.summary?.totalChecks || 0}
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
                              {stats.summary?.minResponseTime?.toFixed(0) || 0}{" "}
                              ms
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Max Response
                            </p>
                            <p className="text-lg font-medium text-white">
                              {stats.summary?.maxResponseTime?.toFixed(0) || 0}{" "}
                              ms
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Downtime</p>
                            <p className="text-lg font-medium text-white">
                              {stats.summary?.downtime?.toFixed(2) || 0}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Last Check</p>
                            <p className="text-lg font-medium text-white">
                              {new Date(
                                stats.summary?.lastChecked
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
                          {stats.summary?.uptime?.toFixed(2) || 0}% of the time
                          in the last {activePeriod} period.
                        </p>

                        <div className="h-4 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${stats.summary?.uptime || 0}%` }}
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
                            {stats.summary?.avgResponseTime?.toFixed(0) || 0} ms
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
                            {stats.summary?.minResponseTime?.toFixed(0) || 0} ms
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
                            {stats.summary?.maxResponseTime?.toFixed(0) || 0} ms
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
                {stats && `Data period: ${activePeriod}`}
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
