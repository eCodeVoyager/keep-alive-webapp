import { Server, LucideLogs, Trash2 } from "lucide-react";

const ServerCard = ({ server, onRemove, onMonitor }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Server size={24} className="text-blue-400" />
      <span className="text-sm">{server.url}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span
        className={`px-2 py-1 !pt-[2px] rounded-full text-xs text-center ${
          server.status === "online" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {server.status}
      </span>
      <button
        onClick={() => onMonitor(server)}
        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        title="View server logs"
        aria-label="View server logs"
      >
        <LucideLogs size={20} />
      </button>
      <button
        onClick={() => onRemove(server._id)}
        className="text-red-500 hover:text-red-400 transition-colors duration-200"
        title="Delete server"
        aria-label="Delete server"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

export default ServerCard;
