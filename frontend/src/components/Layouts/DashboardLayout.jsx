import React, { useState, useContext } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        pathname={location.pathname}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <div className="py-10 px-4 sm:px-6 lg:px-80">
          <div className="flex justify-between items-center mb-10">
            <button onClick={toggleSidebar} className="lg:hidden text-white">
              <Menu size={24} />
            </button>
          </div>
          {children}
          <footer className="text-slate-200 text-center py-4 text-sm fixed bottom-0 left-[50vw]">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/eCodeVoyager"
              target="_blank"
              className="text-green-400"
            >
              Ehsan
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
