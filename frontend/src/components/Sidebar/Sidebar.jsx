import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Send,
  Settings2,
  X,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import Logo from "../Shared/Logo";
import { routes } from "../../router/routes.data";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, pathname }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef(null);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen &&
        window.innerWidth < 768 // Only on mobile
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Improved logout handler with loading state to prevent double clicks
  const handleLogoutClick = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // No need to set isLoggingOut to false as component will unmount on navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-40 h-screen
          bg-gray-800 shadow-xl
          flex flex-col py-6 rounded-tr-2xl rounded-br-2xl
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-full md:w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"}
        `}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex justify-between items-center mb-8 px-4">
          {isOpen ? (
            <Link to={routes.dashboard} className="flex items-center">
              <Logo className="!h-10 !w-10" />
              <span className="text-white text-xl font-bold ml-3">
                KeepAlive
              </span>
            </Link>
          ) : (
            <Link to={routes.dashboard} className="mx-auto">
              <Logo className="!h-10 !w-10" />
            </Link>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`
              hidden md:block text-gray-400 hover:text-white 
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
        <nav className="flex flex-1 flex-col px-4 space-y-2">
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
        <div className="mb-4 mt-8 px-4">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`
              flex items-center text-gray-400 hover:text-white
              py-3 px-4 rounded-lg transition-all duration-300
              hover:bg-gray-700 w-full
              ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-label="Logout"
            title={!isOpen ? "Logout" : ""}
          >
            <div className="flex justify-center w-6 items-center">
              <LogOut size={22} />
            </div>

            {isOpen && (
              <span
                className={`
                ml-3 text-md font-medium whitespace-nowrap overflow-hidden transition-all
                ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}
              `}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
