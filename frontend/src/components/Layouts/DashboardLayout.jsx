import React, { useState, useContext, useCallback } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import LogsModal from "../Dashboard/LogsModal";
import { SidebarContext } from "../../contexts/SidebarContext";
import { WebsiteContext } from "../../contexts/WebsiteContext";
import { toast } from "react-hot-toast";

const DashboardLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverLogs, setServerLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { logout } = useContext(AuthContext);
  const { sidebar, toggleSidebar } = useContext(SidebarContext);
  const { setWebsites, setIsApiCalled } = useContext(WebsiteContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Improved logout handler using useCallback and handling logout state
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    setIsLoggingOut(true);
    try {
      // Reset website data
      setWebsites([]);
      setIsApiCalled(false);

      // Show logout toast
      toast.success("Logged out successfully");

      // Call the logout function from AuthContext
      await logout();

      // Note: navigation happens in the logout method in AuthContext
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.");
      setIsLoggingOut(false);
    }
  }, [logout, setWebsites, setIsApiCalled, isLoggingOut]);

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
    <div className="bg-gray-900 text-white min-h-screen">
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
            className="bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto">{childrenWithProps}</div>

        {/* Footer */}
        <footer className="bg-gray-900/80 border-gray-800 border-t text-center text-gray-400 text-sm backdrop-blur-sm bottom-0 fixed left-0 py-4 right-0">
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
