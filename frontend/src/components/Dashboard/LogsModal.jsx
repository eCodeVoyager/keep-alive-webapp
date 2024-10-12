import React, { useState, useEffect, useRef } from "react";
import { X, Wifi, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogItem from "./LogItem";
import LogItemSkeleton from "../SkeletonLoaders/LogItemSkeleton";

const LogsModal = ({ isOpen, onClose, server, logs, isLoading }) => {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        setShowScrollArrow(scrollTop < scrollHeight - clientHeight - 20);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!isOpen) return null;

  const sortedLogs = logs
    ? [...logs].sort((a, b) => new Date(b.pingAt) - new Date(a.pingAt))
    : [];

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md h-[60vh] flex flex-col relative">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-xl font-bold text-white">Logs: {server?.url}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div
          ref={scrollContainerRef}
          className="space-y-4 flex-grow overflow-y-auto  custom-scrollbar"
        >
          <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between top-0 z-10">
            <div className="flex items-center space-x-2">
              <Wifi size={20} className="text-blue-400" />
              <span className="font-semibold text-white">Status</span>
            </div>
            {isLoading ? (
              <div className="w-16 h-6 bg-gray-600 rounded-full animate-pulse"></div>
            ) : (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  sortedLogs[0]?.status === "200"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {sortedLogs[0]?.status || "N/A"}
              </span>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white top-16 bg-gray-800 py-2 z-10">
              Recent Logs
            </h3>
            {isLoading ? (
              <>
                <LogItemSkeleton />
                <LogItemSkeleton />
                <LogItemSkeleton />
              </>
            ) : sortedLogs.length > 0 ? (
              sortedLogs.map((log) => <LogItem key={log._id} log={log} />)
            ) : (
              <p className="text-gray-400">No logs available.</p>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showScrollArrow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-[47%] "
            >
              <ChevronDown size={24} className="text-gray-400 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LogsModal;
