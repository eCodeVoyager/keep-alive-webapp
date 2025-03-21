// import { Server, LucideLogs, Trash2 } from "lucide-react";

// const ServerCard = ({ server, onRemove, onMonitor }) => (
//   <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
//     <div className="flex items-center space-x-4">
//       <Server size={24} className="text-blue-400" />
//       <span className="text-sm">{server.url}</span>
//     </div>
//     <div className="flex items-center space-x-4">
//       <span
//         className={`px-2 py-1 !pt-[2px] rounded-full text-xs text-center ${
//           server.status === "online" ? "bg-green-500" : "bg-red-500"
//         }`}
//       >
//         {server.status}
//       </span>
//       <button
//         onClick={() => onMonitor(server)}
//         className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
//         title="View server logs"
//         aria-label="View server logs"
//       >
//         <LucideLogs size={20} />
//       </button>
//       <button
//         onClick={() => onRemove(server._id)}
//         className="text-red-500 hover:text-red-400 transition-colors duration-200"
//         title="Delete server"
//         aria-label="Delete server"
//       >
//         <Trash2 size={20} />
//       </button>
//     </div>
//   </div>
// );

// export default ServerCard;
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  BarChart2,
  Trash2,
  Clock,
  ExternalLink,
  MoreVertical,
  Activity,
  Zap,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const ServerCard = ({
  server,
  onRemove,
  onMonitor,
  onStats,
  onPing,
  viewMode = "grid",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    await onPing();
    setTimeout(() => setIsPinging(false), 1000);
  };

  // Format the domain for display
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  // Format the ping time
  const formatPingTime = (pingTime) => {
    if (!pingTime) return "10m";
    return pingTime;
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gray-700 rounded-lg shadow-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={`p-2 rounded-md ${
                server.status === "online" ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <Server
                className={`h-5 w-5 ${
                  server.status === "online" ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {getDomain(server.url)}
              </h3>
              <p className="text-gray-400 text-sm truncate">{server.url}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {formatPingTime(server.ping_time)}
              </span>
            </div>

            <StatusBadge status={server.status} />

            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10"
                  onMouseLeave={closeMenu}
                >
                  <button
                    onClick={() => {
                      closeMenu();
                      onStats();
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View Statistics
                  </button>
                  <button
                    onClick={() => {
                      closeMenu();
                      onMonitor();
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Logs
                  </button>
                  <button
                    onClick={() => {
                      closeMenu();
                      handlePing();
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isPinging ? "animate-spin" : ""
                      }`}
                    />
                    Ping Now
                  </button>
                  <a
                    href={server.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center"
                    onClick={closeMenu}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                  <button
                    onClick={() => {
                      closeMenu();
                      onRemove(server._id);
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gray-700 rounded-xl shadow-lg overflow-hidden h-full"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div
              className={`p-2 rounded-full ${
                server.status === "online" ? "bg-green-500/20" : "bg-red-500/20"
              } mr-3`}
            >
              <Server
                className={`h-5 w-5 ${
                  server.status === "online" ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">
                {getDomain(server.url)}
              </h3>
              <p className="text-gray-400 text-sm truncate max-w-[180px]">
                {server.url}
              </p>
            </div>
          </div>
          <StatusBadge status={server.status} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Ping: {formatPingTime(server.ping_time)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePing}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            disabled={isPinging}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isPinging ? "animate-spin" : ""}`}
            />
            <span className="text-sm">Ping Now</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={onStats}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-600 rounded-lg text-gray-300 flex items-center justify-center transition-colors"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            <span className="text-sm">Statistics</span>
          </button>
          <button
            onClick={onMonitor}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-600 rounded-lg text-gray-300 flex items-center justify-center transition-colors"
          >
            <Activity className="h-4 w-4 mr-2" />
            <span className="text-sm">Logs</span>
          </button>
        </div>

        <div className="flex justify-between items-center">
          <a
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit
          </a>
          <button
            onClick={() => onRemove(server._id)}
            className="text-red-400 hover:text-red-300 transition-colors text-sm flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServerCard;
