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
    className={`ml-[20px] mt-[2dvh] h-[96dvh] bg-gray-800 rounded-xl flex flex-col items-center py-4 transition-all duration-300 ${
      isOpen ? "w-64" : "w-16"
    }`}
  >
    <div className="flex items-center justify-between w-full px-4 mb-6">
      {isOpen && (
        <div className="flex gap-3 text-white font-bold text-2xl ">
          <Logo className="!w-10 !h-10" />
          KeepAlive
        </div>
      )}
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-white"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>

    <nav className="flex-1 flex flex-col items-center space-y-2 w-full px-4 pt-3">
      <SidebarLink
        icon={<Home size={24} />}
        label="Dashboard"
        isOpen={isOpen}
        isActive={true}
      />
      <SidebarLink icon={<Ticket size={24} />} label="Ticket" isOpen={isOpen} />
      <SidebarLink
        icon={<Settings2 size={24} />}
        label="Settings"
        isOpen={isOpen}
      />
    </nav>

    <div className="w-full px-4 mt-auto">
      <SidebarLink
        icon={<LogOut size={24} />}
        label="Logout"
        isOpen={isOpen}
        onLinkClick={handleLogout}
      />
    </div>
  </div>
);

export default Sidebar;
