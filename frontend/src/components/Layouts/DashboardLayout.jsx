import React, { useState, useContext } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import LogsModal from "../Dashboard/LogsModal";
import { SidebarContext } from "../../contexts/SidebarContext";
import { WebsiteContext } from "../../contexts/WebsiteContext";

const DashboardLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useContext(AuthContext);
  const { sidebar, toggleSidebar } = useContext(SidebarContext);
  const { setWebsites, setIsApiCalled } = useContext(WebsiteContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setWebsites([]);
    setIsApiCalled(false);
    navigate("/login");
  };

  const openModal = (server, logs) => {
    setSelectedServer(server);
    setServerLogs(logs);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
    setServerLogs([]);
  };

  // Clone children and pass necessary props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { openModal });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebar}
        handleLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        pathname={location.pathname}
      />

      {/* Main Content */}
      <main
        className={`
        transition-all duration-300 ease-in-out
        ${sidebar ? "md:ml-64" : "md:ml-20"}
        pt-6 px-4 md:px-8 pb-16
      `}
      >
        {/* Mobile Menu Button */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto">{childrenWithProps}</div>

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-400 fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/eCodeVoyager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            Ehsan
          </a>
        </footer>
      </main>

      {/* Logs Modal */}
      <LogsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        server={selectedServer}
        logs={serverLogs}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardLayout;
