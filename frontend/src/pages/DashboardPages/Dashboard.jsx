import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import ServerForm from "../../components/Dashboard/ServerForm";
import ServerCard from "../../components/Dashboard/ServerCard";
import LogsModal from "../../components/Dashboard/LogsModal";
import StatsModal from "../../components/Dashboard/StatsModal";
import ServerService from "../../services/serverService";
import logService from "../../services/logService";
import statsService from "../../services/statsService";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { WebsiteContext } from "../../contexts/WebsiteContext";
import ServerCardSkeleton from "../../components/SkeletonLoaders/ServerCardSkeleton";
import { UserContext } from "../../contexts/UserContext";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { websites, setWebsites, isApiCalled, setIsApiCalled } =
    useContext(WebsiteContext);
  const { user } = useContext(UserContext);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [serverStats, setServerStats] = useState(null);
  const [isLogLoading, setIsLogLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalWebsites: 0,
    onlineWebsites: 0,
    offlineWebsites: 0,
    averageUptime: 0,
  });
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    const fetchServers = async () => {
      try {
        if (!websites || websites.length === 0) {
          if (!isApiCalled) {
            const response = await ServerService.getAllServers();
            console.log("API called");
            const data = response.data.docs;
            setWebsites(data);
            calculateDashboardStats(data);
          }
        } else {
          setWebsites(websites);
          calculateDashboardStats(websites);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setWebsites([]);
          setIsApiCalled(true);
        } else {
          toast.error(
            error.response?.data?.message || "Error fetching servers"
          );
        }
      } finally {
        setIsSkeletonLoading(false);
      }
    };

    fetchServers();
  }, [websites, isApiCalled, setWebsites, setIsApiCalled]);

  const calculateDashboardStats = (websiteData) => {
    if (!websiteData || websiteData.length === 0) {
      setDashboardStats({
        totalWebsites: 0,
        onlineWebsites: 0,
        offlineWebsites: 0,
        averageUptime: 0,
      });
      return;
    }

    const online = websiteData.filter(
      (site) => site.status === "online"
    ).length;

    setDashboardStats({
      totalWebsites: websiteData.length,
      onlineWebsites: online,
      offlineWebsites: websiteData.length - online,
      averageUptime: (online / websiteData.length) * 100,
    });
  };

  const addServer = async (newServerUrl, interval) => {
    try {
      setIsLoading(true);
      const { data } = await ServerService.createServer({
        url: newServerUrl,
        ping_time: interval,
      });
      setWebsites([...websites, data]);
      calculateDashboardStats([...websites, data]);
      toast.success("Server added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding server");
    } finally {
      setIsLoading(false);
    }
  };

  const testUrl = async (url) => {
    try {
      setIsTestingUrl(true);
      const { data } = await ServerService.testWebsite(url);

      const statusMsg =
        data.status === "online"
          ? `Website is online (Status: ${data.statusCode}, Response Time: ${data.responseTime}ms)`
          : `Website is offline (${data.error || "Connection failed"})`;

      toast.success(statusMsg);
      return data.status === "online";
    } catch (error) {
      toast.error("Error testing website");
      return false;
    } finally {
      setIsTestingUrl(false);
    }
  };

  const removeServer = async (id) => {
    try {
      await ServerService.deleteServer(id);
      const updatedWebsites = websites.filter((server) => server._id !== id);
      setWebsites(updatedWebsites);
      calculateDashboardStats(updatedWebsites);
      toast.success("Server removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing server");
    }
  };

  const pingServer = async (id) => {
    try {
      const { data } = await ServerService.pingWebsite(id);
      // Update website status in the list
      const updatedWebsites = websites.map((site) =>
        site._id === id ? { ...site, status: data.status } : site
      );
      setWebsites(updatedWebsites);
      calculateDashboardStats(updatedWebsites);

      toast.success(
        data.status === "online"
          ? `Ping successful! (${data.responseTime}ms)`
          : "Ping failed. Website is offline."
      );
    } catch (error) {
      toast.error("Error pinging website");
    }
  };

  const openMonitoringModal = async (server) => {
    setSelectedServer(server);
    setIsModalOpen(true);
    setIsLogLoading(true);
    try {
      const { data } = await logService.getLogs(server.url);
      setServerLogs(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching logs");
    } finally {
      setIsLogLoading(false);
    }
  };

  const openStatsModal = async (server) => {
    setSelectedServer(server);
    setIsStatsModalOpen(true);
    setIsStatsLoading(true);

    try {
      const response = await statsService.getWebsiteStats(server._id);
      console.log("API Stats Response:", response);
      setServerStats(response);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error(error.response?.data?.message || "Error fetching statistics");
    } finally {
      setIsStatsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
    setServerLogs([]);
  };

  const closeStatsModal = () => {
    setIsStatsModalOpen(false);
    setSelectedServer(null);
    setServerStats(null);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header and View Toggle */}
        <div className="flex flex-col justify-between gap-4 items-start md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl text-white font-bold mb-2 md:text-3xl">
              Dashboard
            </h2>
            <p className="text-gray-400">
              Welcome back, {user?.name || "User"}. Monitor your websites and
              keep them alive.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleViewMode}
              className="bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-600 transition-colors"
              title={
                viewMode === "grid"
                  ? "Switch to list view"
                  : "Switch to grid view"
              }
              aria-label={
                viewMode === "grid"
                  ? "Switch to list view"
                  : "Switch to grid view"
              }
            >
              {viewMode === "grid" ? (
                <BarChart3 className="h-5 text-gray-300 w-5" />
              ) : (
                <Activity className="h-5 text-gray-300 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Server className="h-5 text-blue-500 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-medium md:text-sm">
                  Total Websites
                </h3>
                <p className="text-white text-xl font-bold md:text-2xl">
                  {dashboardStats.totalWebsites}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <ArrowUpRight className="h-5 text-green-500 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-medium md:text-sm">
                  Online
                </h3>
                <p className="text-white text-xl font-bold md:text-2xl">
                  {dashboardStats.onlineWebsites}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <AlertTriangle className="h-5 text-red-500 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-medium md:text-sm">
                  Offline
                </h3>
                <p className="text-white text-xl font-bold md:text-2xl">
                  {dashboardStats.offlineWebsites}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <TrendingUp className="h-5 text-purple-500 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-medium md:text-sm">
                  Avg. Uptime
                </h3>
                <p className="text-white text-xl font-bold md:text-2xl">
                  {dashboardStats.averageUptime.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Server Form */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg md:p-6">
          <h3 className="text-lg text-white font-bold mb-4 md:text-xl">
            Add New Website
          </h3>
          <ServerForm
            addServer={addServer}
            isLoading={isLoading}
            testUrl={testUrl}
            isTestingUrl={isTestingUrl}
          />
        </div>

        {/* Server List */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-20 md:p-6">
          <h3 className="text-lg text-white font-bold mb-4 md:mb-6 md:text-xl">
            Your Websites
          </h3>
          {isSkeletonLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, index) => (
                <ServerCardSkeleton key={index} />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-center text-center items-center md:py-10 py-8"
            >
              <AlertCircle className="h-10 text-gray-500 w-10 mb-4 md:h-12 md:w-12" />
              <h3 className="text-gray-300 text-lg font-semibold mb-2 md:text-xl">
                No websites yet
              </h3>
              <p className="text-gray-400 max-w-md mb-6">
                Add your first website to start monitoring and keep it alive
                24/7.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col space-y-4"
                }
              >
                {websites.map((server) => (
                  <motion.div key={server._id} variants={itemVariants} layout>
                    <ServerCard
                      server={server}
                      onRemove={removeServer}
                      onMonitor={() => openMonitoringModal(server)}
                      onStats={() => openStatsModal(server)}
                      onPing={() => pingServer(server._id)}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      <LogsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        server={selectedServer}
        logs={serverLogs}
        isLoading={isLogLoading}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={closeStatsModal}
        server={selectedServer}
        isLoading={isStatsLoading}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
