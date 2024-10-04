import { Server, Monitor, Trash2 } from "lucide-react";
import props from "prop-types";

const ServerCard = ({ server, onRemove, onMonitor }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <Server size={24} className="text-blue-400" />
      <span className="text-sm">{server.url}</span>
    </div>
    <div className="flex items-center space-x-4">
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          server.status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {server.status}
      </span>
      <button
        onClick={() => onMonitor(server)}
        className="text-blue-400 hover:text-blue-300"
      >
        <Monitor size={20} />
      </button>
      <button
        onClick={() => onRemove(server.id)}
        className="text-red-500 hover:text-red-400"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

ServerCard.propTypes = {
  server: props.object.isRequired,
  onRemove: props.func.isRequired,
  onMonitor: props.func.isRequired,
};

export default ServerCard;
