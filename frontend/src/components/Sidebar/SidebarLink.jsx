import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const SidebarLink = ({ icon, label, isOpen }) => (
  <Link
    to="/"
    className={`flex items-center space-x-4 text-white hover:text-green-400 p-4 rounded-lg transition-all duration-300 ${
      isOpen ? "w-full" : "w-16"
    }`}
  >
    {icon}
    <span className={`${isOpen ? "block" : "hidden"}`}>{label}</span>
  </Link>
);

SidebarLink.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
export default SidebarLink;
