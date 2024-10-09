import { useState, useContext, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import ServerCard from "../components/Dashboard/ServerCard";
import MonitoringModal from "../components/Dashboard/MonitoringModal";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ServerForm from "../components/Dashboard/ServerForm";
import ServerService from "../services/serverService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monitoredServer, setMonitoredServer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        const { data } = await ServerService.getAllServers();
        setServers(data);
      } catch (error) {
        if (error.response.status === 401) {
          logout();
          navigate("/login");
        } else if (error.response.status === 404) {
          return setServers([]);
        } else {
          toast.error(error.response.data.message || "Error fetching servers");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
      toast.error(error.response.data.message || "Error adding server");
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
      toast.error(error.response.data.message || "Error removing server");
    }
  };

  const openMonitoringModal = (server) => {
    setMonitoredServer(server);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar
        isOpen={isSidebarOpen}
        handleLogout={handleLogout}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-1 py-20 px-80 transition-all duration-300 `}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={toggleSidebar} className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
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
      </div>
      <MonitoringModal
        isOpen={!!monitoredServer}
        onClose={() => setMonitoredServer(null)}
        server={monitoredServer}
      />
    </div>
  );
};

export default Dashboard;
