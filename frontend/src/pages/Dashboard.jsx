import { useState, useEffect, useContext } from "react";
import ServerCard from "../components/Dashboard/ServerCard";
import MonitoringModal from "../components/Dashboard/MonitoringModal";
import ServerForm from "../components/Dashboard/ServerForm";
import ServerService from "../services/serverService";
import toast from "react-hot-toast";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { motion } from "framer-motion";
import { WebsiteContext } from "../contexts/WebsiteContext";

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monitoredServer, setMonitoredServer] = useState(null);
  const { websites, setWebsites } = useContext(WebsiteContext);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        if (websites.length === 0) {
          const { data } = await ServerService.getAllServers();
          setWebsites(data);
          setServers(data);
        } else {
          setServers(websites);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setServers([]);
        } else {
          toast.error(
            error.response?.data?.message || "Error fetching servers"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  const addServer = async (newServerUrl, interval) => {
    setIsLoading(true);
    try {
      const { data } = await ServerService.createServer({
        url: newServerUrl,
        ping_time: interval,
      });
      setServers([...servers, data]);
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
      setServers(servers.filter((server) => server._id !== id));
      toast.success("Server removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing server");
    }
  };

  const openMonitoringModal = (server) => {
    setMonitoredServer(server);
  };

  return (
    <DashboardLayout PageName="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
        <ServerForm addServer={addServer} isLoading={isLoading} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onRemove={removeServer}
              onMonitor={openMonitoringModal}
            />
          ))}
        </div>
        <MonitoringModal
          isOpen={!!monitoredServer}
          onClose={() => setMonitoredServer(null)}
          server={monitoredServer}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
