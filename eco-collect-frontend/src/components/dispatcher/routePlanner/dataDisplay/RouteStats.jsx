import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';

const RouteStats = ({ 
  routeStats, 
  routesCount, 
  routesLoading, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Routes Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total: {routeStats.total} routes | 
          Pending: {routeStats.pending} | 
          In Progress: {routeStats.inProgress} | 
          Completed: {routeStats.completed}
          {routesCount > 3 && (
            <span className="ml-2 text-emerald-600">• Scroll to see more</span>
          )}
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={routesLoading}
        className="flex items-center px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiOutlineArrowRight className={`w-4 h-4 mr-2 ${routesLoading ? 'animate-spin' : ''}`} />
        {routesLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};

export default RouteStats;
