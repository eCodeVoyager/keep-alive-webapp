const LogItemSkeleton = () => (
  <div className="bg-gray-700 p-4 rounded-lg mb-4 animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="h-4 w-32 bg-gray-600 rounded"></div>
      <div className="h-6 w-16 bg-gray-600 rounded-full"></div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-4 w-4 bg-gray-600 rounded"></div>
      <div className="h-4 w-16 bg-gray-600 rounded"></div>
    </div>
  </div>
);

export default LogItemSkeleton;
