import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Send,
  Settings2,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import Logo from "../Shared/Logo";
import { routes } from "../../router/routes.data";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, pathname }) => (
  <div
    className={`
      fixed top-0 left-0 z-40 h-screen
      bg-gray-800 shadow-xl rounded-r-xl
      flex flex-col py-6
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-20"}
      ${isOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}
    `}
  >
    {/* Header with Logo and Toggle */}
    <div className="px-4 mb-8 flex items-center justify-between">
      {isOpen ? (
        <Link to={routes.dashboard} className="flex items-center">
          <Logo className="!w-10 !h-10" />
          <span className="ml-3 text-white font-bold text-xl">KeepAlive</span>
        </Link>
      ) : (
        <Link to={routes.dashboard} className="mx-auto">
          <Logo className="!w-10 !h-10" />
        </Link>
      )}

      <button
        onClick={toggleSidebar}
        className={`
          text-gray-400 hover:text-white 
          hover:bg-gray-700 p-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-gray-500
          ${
            isOpen
              ? ""
              : "absolute right-0 translate-x-full mt-2 bg-gray-800 rounded-l-none rounded-r-lg shadow-lg"
          }
        `}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 flex flex-col px-4 space-y-2">
      <SidebarLink
        icon={<Home size={22} />}
        label="Dashboard"
        to={routes.dashboard}
        isOpen={isOpen}
        isActive={pathname === routes.dashboard}
      />
      <SidebarLink
        icon={<Send size={22} />}
        label="Feedback"
        to={routes.feedback}
        isOpen={isOpen}
        isActive={pathname === routes.feedback}
      />
      <SidebarLink
        icon={<Settings2 size={22} />}
        label="Settings"
        to={routes.settings}
        isOpen={isOpen}
        isActive={pathname === routes.settings}
      />
    </nav>

    {/* Footer with Logout */}
    <div className="px-4 mt-8 mb-4">
      <SidebarLink
        icon={<LogOut size={22} />}
        label="Logout"
        isOpen={isOpen}
        onLinkClick={handleLogout}
        to={routes.login}
      />
    </div>
  </div>
);

export default Sidebar;
