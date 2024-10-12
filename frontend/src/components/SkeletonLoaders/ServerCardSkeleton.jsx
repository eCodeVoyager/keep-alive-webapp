import { Server } from "lucide-react";

const ServerCardSkeleton = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between animate-pulse">
    <div className="flex items-center space-x-4">
      <Server size={24} className="text-gray-600" />
      <div className="h-4 w-40 bg-gray-600 rounded"></div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="h-6 w-16 bg-gray-600 rounded-full"></div>
      <div className="h-5 w-5 bg-gray-600 rounded"></div>
      <div className="h-5 w-5 bg-gray-600 rounded"></div>
    </div>
  </div>
);

export default ServerCardSkeleton;
