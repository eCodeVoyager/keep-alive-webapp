import { Link } from "react-router-dom";

const SidebarLink = ({ icon, label, isOpen, isActive, to, onLinkClick }) => (
  <Link
    to={to}
    onClick={onLinkClick}
    className={`
      flex items-center text-gray-400 hover:text-white
      py-3 px-4 rounded-lg transition-all duration-300
      ${isOpen ? "justify-start" : "justify-center"}
      ${
        isActive
          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
          : "hover:bg-gray-700"
      }
    `}
    aria-label={label}
    title={!isOpen ? label : ""}
  >
    <div className="flex items-center justify-center w-6">{icon}</div>

    {isOpen && (
      <span
        className={`
        ml-3 text-md font-medium whitespace-nowrap overflow-hidden transition-all
        ${isOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}
      `}
      >
        {label}
      </span>
    )}
  </Link>
);

export default SidebarLink;
