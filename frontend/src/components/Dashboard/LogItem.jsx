import { Clock, Calendar } from "lucide-react";

const LogItem = ({ log }) => {
  // Format the date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const isSuccess = log.status === "200";

  return (
    <div
      className={`
      bg-gray-700 p-4 rounded-lg transition-transform hover:translate-y-[-2px]
      border-l-4 ${isSuccess ? "border-green-500" : "border-red-500"}
    `}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex text-gray-400 text-sm items-center">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(log.pingAt)}</span>
        </div>
        <span
          className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${isSuccess ? "bg-green-500" : "bg-red-500"} text-white
        `}
        >
          {log.status}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock size={16} className="text-blue-400" />
        <span className="text-gray-300">{log.responseTime}ms</span>
      </div>
    </div>
  );
};

export default LogItem;
