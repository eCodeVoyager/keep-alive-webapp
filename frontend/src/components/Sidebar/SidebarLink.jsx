import { Link } from "react-router-dom";
const SidebarLink = ({ icon, label, isOpen, isActive, to, onLinkClick }) => (
  <Link
    to={to}
    onClick={onLinkClick}
    className={`flex items-center space-x-4 text-gray-400 hover:text-white p-3 rounded-lg transition-all duration-300 ${
      isOpen ? "w-full" : "w-16"
    } ${
      isActive ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" : ""
    }`}
  >
    {icon}
    <span className={`${isOpen ? "block" : "hidden"} text-md font-medium`}>
      {label}
    </span>
  </Link>
);

export default SidebarLink;
