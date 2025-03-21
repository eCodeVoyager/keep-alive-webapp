import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const StatusBadge = ({ status, className = "", size = "md" }) => {
  // Define styles based on status
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "online":
        return {
          backgroundColor: "bg-green-500",
          backgroundOpacity: "bg-opacity-20",
          textColor: "text-green-500",
          borderColor: "border-green-500",
          icon: CheckCircle,
          label: "Online",
        };
      case "offline":
        return {
          backgroundColor: "bg-red-500",
          backgroundOpacity: "bg-opacity-20",
          textColor: "text-red-500",
          borderColor: "border-red-500",
          icon: XCircle,
          label: "Offline",
        };
      default:
        return {
          backgroundColor: "bg-yellow-500",
          backgroundOpacity: "bg-opacity-20",
          textColor: "text-yellow-500",
          borderColor: "border-yellow-500",
          icon: AlertTriangle,
          label: "Unknown",
        };
    }
  };

  const {
    backgroundColor,
    backgroundOpacity,
    textColor,
    borderColor,
    icon: StatusIcon,
    label,
  } = getStatusConfig();

  // Apply size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          paddingX: "px-2",
          paddingY: "py-0.5",
          fontSize: "text-xs",
          iconSize: "h-3 w-3",
          gap: "gap-1",
        };
      case "lg":
        return {
          paddingX: "px-3",
          paddingY: "py-1.5",
          fontSize: "text-md",
          iconSize: "h-5 w-5",
          gap: "gap-2",
        };
      case "md":
      default:
        return {
          paddingX: "px-2.5",
          paddingY: "py-1",
          fontSize: "text-sm",
          iconSize: "h-4 w-4",
          gap: "gap-1.5",
        };
    }
  };

  const { paddingX, paddingY, fontSize, iconSize, gap } = getSizeClasses();

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full ${backgroundColor} ${backgroundOpacity} ${paddingX} ${paddingY} border ${borderColor} ${textColor} ${gap} ${className}`}
    >
      <StatusIcon className={iconSize} />
      <span className={fontSize}>{label}</span>
    </motion.div>
  );
};

export default StatusBadge;
