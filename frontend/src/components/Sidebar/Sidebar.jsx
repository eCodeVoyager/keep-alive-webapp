import {
  ChevronLeft,
  ChevronRight,
  Home,
  Ticket,
  LogOut,
  Settings2,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import Logo from "../Shared/Logo";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => (
  <div
    className={`fixed left-[20px] top-[2%] h-[96%] bg-gray-800 rounded-xl flex flex-col items-center py-4 transition-all duration-300 ${
      isOpen ? "w-64" : "w-16"
    }`}
  >
    <div className="flex items-center justify-between w-full px-4 mb-6">
      {isOpen && (
        <div className="flex gap-3 text-white font-bold text-2xl ">
          <Logo size={10} iconSize={3} />
          KeepAlive
        </div>
      )}
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-white"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    </div>

    <nav className="flex-1 flex flex-col items-center space-y-2 w-full px-4">
      <SidebarLink
        icon={<Home size={20} />}
        label="Dashboard"
        isOpen={isOpen}
        isActive={true}
      />
      <SidebarLink icon={<Ticket size={20} />} label="Ticket" isOpen={isOpen} />
      <SidebarLink
        icon={<Settings2 size={20} />}
        label="Settings"
        isOpen={isOpen}
      />
    </nav>

    <div className="w-full px-4 mt-auto">
      <SidebarLink
        icon={<LogOut size={20} />}
        label="Logout"
        isOpen={isOpen}
        onLinkClick={handleLogout}
      />
    </div>
  </div>
);

export default Sidebar;
