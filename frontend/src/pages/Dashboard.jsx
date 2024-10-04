import  { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Plus,
  Trash2,
  Home,
  Settings,
  LogOut,
  Monitor,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const initialServers = [
  { id: 1, url: "https://prod.example.com", status: "active" },
  { id: 2, url: "https://staging.example.com", status: "inactive" },
  { id: 3, url: "https://dev.example.com", status: "active" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <div
    className={`fixed left-0 top-0 h-full bg-gray-800 flex flex-col items-center py-4 space-y-8 transition-all duration-300 ${
      isOpen ? "w-64" : "w-16"
    }`}
  >
    <div className="flex items-center justify-between w-full px-4">
      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <Activity className="w-8 h-8 text-white" />
      </div>
      <button
        onClick={toggleSidebar}
        className="text-white hover:text-green-400"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    </div>
    <nav className="flex-1 flex flex-col items-center space-y-4 w-full">
      <SidebarLink icon={<Home size={24} />} label="Home" isOpen={isOpen} />
      <SidebarLink
        icon={<Server size={24} />}
        label="Servers"
        isOpen={isOpen}
      />
      <SidebarLink
        icon={<Settings size={24} />}
        label="Settings"
        isOpen={isOpen}
      />
    </nav>
    <SidebarLink icon={<LogOut size={24} />} label="Logout" isOpen={isOpen} />
  </div>
);

const SidebarLink = ({ icon, label, isOpen }) => (
  <a
    href="#"
    className="text-white hover:text-green-400 w-full px-4 py-2 flex items-center"
  >
    {icon}
    {isOpen && <span className="ml-4">{label}</span>}
  </a>
);

const ServerCard = ({ server, onRemove, onMonitor }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Server size={24} className="text-blue-400" />
      <span className="text-sm">{server.url}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          server.status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {server.status}
      </span>
      <button
        onClick={() => onMonitor(server)}
        className="text-blue-400 hover:text-blue-300"
      >
        <Monitor size={20} />
      </button>
      <button
        onClick={() => onRemove(server.id)}
        className="text-red-500 hover:text-red-400"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

const MonitoringModal = ({ isOpen, onClose, server }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Monitoring: {server?.url}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ping Data</h3>
            <div className="h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="mt-2 text-sm">Average response time: 42ms</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Uptime</h3>
            <p className="text-2xl font-bold text-green-500">99.9%</p>
            <p className="mt-2 text-sm">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [servers, setServers] = useState(initialServers);
  const [newServerUrl, setNewServerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [monitoredServer, setMonitoredServer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
