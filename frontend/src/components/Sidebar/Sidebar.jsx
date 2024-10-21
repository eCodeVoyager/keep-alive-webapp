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
    className={`ml-[20px] mt-[2dvh] h-[96dvh] bg-gray-800 rounded-xl flex flex-col items-center  py-4 transition-all duration-300 ${
      isOpen ? "w-64" : "w-16"
    }`}
  >
    <div
      className={`${
        isOpen
          ? "flex items-center justify-between w-full px-4 mb-6"
          : "justify-center"
      }`}
    >
      {isOpen && (
        <Link to={routes.dashboard}>
          <div className="flex gap-3 text-white font-bold text-2xl ">
            <Logo className="!w-10 !h-10" />
            KeepAlive
          </div>
        </Link>
      )}
      <button
        onClick={toggleSidebar}
        className="text-gray-400 hover:text-white"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>

    <nav
      className={`flex-1 flex flex-col items-center space-y-2 w-full px-4 pt-3 ${
        isOpen ? "" : "!pt-6"
      }`}
    >
      <SidebarLink
        icon={<Home size={24} />}
        label="Dashboard"
        to={routes.dashboard}
        isOpen={isOpen}
        isActive={pathname === routes.dashboard ? true : false}
      />
      <SidebarLink
        icon={<Send size={24} />}
        label="Feedback"
        to={routes.feedback}
        isOpen={isOpen}
        isActive={pathname === routes.feedback ? true : false}
      />
      <SidebarLink
        icon={<Settings2 size={24} />}
        label="Settings"
        to={routes.settings}
        isOpen={isOpen}
        isActive={pathname === routes.settings ? true : false}
      />
    </nav>

    <div className={`${isOpen ? "w-full px-4 mt-auto" : ""}`}>
      <SidebarLink
        icon={<LogOut size={24} />}
        label="Logout"
        isOpen={isOpen}
        onLinkClick={handleLogout}
        to={routes.login}
      />
    </div>
  </div>
);

export default Sidebar;
