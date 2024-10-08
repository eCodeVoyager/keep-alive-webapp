import { useState, useContext } from "react";
import { Plus, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import ServerCard from "../components/Dashboard/ServerCard";
import MonitoringModal from "../components/Dashboard/MonitoringModal";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const initialServers = [
  { id: 1, url: "https://prod.example.com", status: "active" },
  { id: 2, url: "https://staging.example.com", status: "inactive" },
  { id: 3, url: "https://dev.example.com", status: "active" },
];

const Dashboard = () => {
  const [servers, setServers] = useState(initialServers);
  const [newServerUrl, setNewServerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [monitoredServer, setMonitoredServer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addServer = async (e) => {
    e.preventDefault();
    if (!newServerUrl) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newServer = {
        id: servers.length + 1,
        url: newServerUrl,
        status: Math.random() > 0.5 ? "active" : "inactive",
      };
      setServers([...servers, newServer]);
      setNewServerUrl("");
      alert("Server added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeServer = (id) => {
    setServers(servers.filter((server) => server.id !== id));
    alert("Server removed");
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
      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={toggleSidebar} className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
        <form onSubmit={addServer} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newServerUrl}
            onChange={(e) => setNewServerUrl(e.target.value)}
            placeholder="Enter server URL"
            className="flex-grow px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
          >
            <Plus className="mr-2" /> Add Server
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
