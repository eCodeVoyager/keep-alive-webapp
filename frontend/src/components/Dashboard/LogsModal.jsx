import React, { useState, useEffect, useRef } from "react";
import { X, Wifi, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogItem from "./LogItem";
import LogItemSkeleton from "../SkeletonLoaders/LogItemSkeleton";

const LogsModal = ({ isOpen, onClose, server, logs, isLoading }) => {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

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

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sortedLogs = logs
    ? [...logs].sort((a, b) => new Date(b.pingAt) - new Date(a.pingAt))
    : [];

  return (
    <div className="flex bg-black bg-opacity-50 justify-center p-4 fixed inset-0 items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        ref={modalRef}
        className="flex flex-col bg-gray-800 rounded-lg w-full max-h-[80vh] max-w-md relative"
      >
        <div className="flex border-b border-gray-700 justify-between p-4 items-center">
          <h2 className="text-white text-xl font-bold">
            Logs:{" "}
            <span className="text-gray-300 text-sm break-all">
              {server?.url}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-gray-700 p-4">
          <div className="flex bg-gray-700 justify-between p-3 rounded-lg items-center">
            <div className="flex items-center space-x-2">
              <Wifi size={20} className="text-blue-400" />
              <span className="text-white font-semibold">Current Status</span>
            </div>
            {isLoading ? (
              <div className="bg-gray-600 h-6 rounded-full w-16 animate-pulse"></div>
            ) : (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sortedLogs[0]?.status === "200"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {sortedLogs[0]?.status || "N/A"}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg text-white font-semibold mb-3">Recent Logs</h3>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-grow p-4 custom-scrollbar overflow-y-auto pt-0 space-y-3"
        >
          {isLoading ? (
            <>
              <LogItemSkeleton />
              <LogItemSkeleton />
              <LogItemSkeleton />
            </>
          ) : sortedLogs.length > 0 ? (
            sortedLogs.map((log) => <LogItem key={log._id} log={log} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No logs available.</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showScrollArrow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="-translate-x-1/2 absolute bottom-4 left-1/2 transform"
            >
              <ChevronDown size={24} className="text-gray-400 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LogsModal;
