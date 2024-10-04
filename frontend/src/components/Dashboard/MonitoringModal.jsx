import { X } from "lucide-react";
import props from "prop-types";

const MonitoringModal = ({ isOpen, onClose, server }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Monitoring: {server?.url}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ping Data</h3>
            <div className="h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="mt-2 text-sm">Average response time: 42ms</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Uptime</h3>
            <p className="text-2xl font-bold text-green-500">99.9%</p>
            <p className="mt-2 text-sm">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

MonitoringModal.propTypes = {
  isOpen: props.bool.isRequired,
  onClose: props.func.isRequired,
  server: props.object,
};

export default MonitoringModal;
