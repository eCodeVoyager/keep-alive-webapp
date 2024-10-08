import { Activity } from "lucide-react";
import props from "prop-types";

const Logo = ({ className = "", iconSize }) => {
  const finalIconSize = iconSize || 11;

  return (
    <div
      className={`
        ${className}
        w-16 h-16
        bg-gradient-to-br from-green-400 to-blue-500
        rounded-full flex items-center justify-center
      `}
    >
      <Activity
        className={`w-${finalIconSize} h-${finalIconSize} text-white`}
      />
    </div>
  );
};

Logo.propTypes = {
  className: props.string,
  iconSize: props.number,
};

export default Logo;
