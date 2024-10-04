import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Server,
  Settings,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import props from "prop-types";

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

Sidebar.propTypes = {
  isOpen: props.bool.isRequired,
  toggleSidebar: props.func.isRequired,
};

export default Sidebar;
