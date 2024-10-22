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
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar
        isOpen={sidebar}
        handleLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        pathname={location.pathname}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <div className="py-10 px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-60">
          <div className="flex justify-between items-center mb-10">
            <button onClick={toggleSidebar} className="lg:hidden text-white">
              <Menu size={24} />
            </button>
          </div>
          {childrenWithProps}
          <footer className="text-slate-200 text-center py-4 text-sm fixed bottom-0 left-[50vw]">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/eCodeVoyager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400"
            >
              Ehsan
            </a>
          </footer>
        </div>
      </div>
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
