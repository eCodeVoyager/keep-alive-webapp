import { Clock } from "lucide-react";

const LogItem = ({ log }) => (
  <div className="bg-gray-700 p-4 rounded-lg mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-400">
        {new Date(log.pingAt).toLocaleString()}
      </span>
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          log.status === "200" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {log.status}
      </span>
    </div>
    <div className="flex items-center space-x-2">
      <Clock size={16} className="text-blue-400" />
      <span>{log.responseTime}ms</span>
    </div>
  </div>
);

export default LogItem;
