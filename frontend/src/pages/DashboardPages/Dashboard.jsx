import React, { useState, useEffect, useContext } from "react";
import ServerCard from "../../components/Dashboard/ServerCard";
import LogsModal from "../../components/Dashboard/LogsModal";
import ServerForm from "../../components/Dashboard/ServerForm";
import ServerService from "../../services/serverService";
import logService from "../../services/logService";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { motion } from "framer-motion";
import { WebsiteContext } from "../../contexts/WebsiteContext";
import ServerCardSkeleton from "../../components/SkeletonLoaders/ServerCardSkeleton";
import { Info } from "lucide-react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { websites, setWebsites, isApiCalled, setIsApiCalled } =
    useContext(WebsiteContext);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [isLogLoading, setIsLogLoading] = useState(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        if (!websites || websites.length === 0) {
          if (!isApiCalled) {
            console.log("API called");
            const { data } = await ServerService.getAllServers();
            setWebsites(data);
          }
        } else {
          setWebsites(websites);
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

  const addServer = async (newServerUrl, interval) => {
    try {
      setIsLoading(true);
      const { data } = await ServerService.createServer({
        url: newServerUrl,
        ping_time: interval,
      });
      setWebsites([...websites, data]);
      toast.success("Server added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding server");
    } finally {
      setIsLoading(false);
    }
  };

  const removeServer = async (id) => {
    try {
      await ServerService.deleteServer(id);
      setWebsites(websites.filter((server) => server._id !== id));
      toast.success("Server removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing server");
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
    setServerLogs([]);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
        <ServerForm addServer={addServer} isLoading={isLoading} />
        <div
          className={`grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 ${
            websites.length === 0 ? "!grid-cols-1" : ""
          }`}
        >
          {isSkeletonLoading ? (
            [...Array(4)].map((_, index) => <ServerCardSkeleton key={index} />)
          ) : websites.length === 0 ? (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Info size={28} className=" text-slate-400" />
              <h2 className="font-semibold text-xl text-slate-400  ">
                No servers added yet
              </h2>
            </div>
          ) : (
            websites.map((websites) => (
              <ServerCard
                key={websites._id}
                server={websites}
                onRemove={removeServer}
                onMonitor={() => openMonitoringModal(websites)}
              />
            ))
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
    </DashboardLayout>
  );
};

export default Dashboard;

