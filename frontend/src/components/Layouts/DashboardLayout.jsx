import  { useState, useContext } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button onClick={toggleSidebar} className="lg:hidden text-white">
              <Menu size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
