import { Link } from "react-router-dom";
const SidebarLink = ({ icon, label, isOpen, isActive, to, onLinkClick }) => (
  <Link
    to={to}
    onClick={onLinkClick}
    className={`flex items-center space-x-4 text-gray-400 hover:text-white p-3 rounded-lg transition-all duration-300 ${
      isOpen ? "w-full" : "w-16"
    } ${isActive ? "bg-indigo-600 text-white" : ""}`}
  >
    {icon}
    <span className={`${isOpen ? "block" : "hidden"} text-sm`}>{label}</span>
  </Link>
);

export default SidebarLink;
