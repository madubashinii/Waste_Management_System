import React from 'react';
import {
  HiOutlineFilter,
  HiOutlineSearch,
} from 'react-icons/hi';

const RouteStopsFilterBar = ({ 
  selectedRoute, 
  onRouteChange, 
  statusFilter, 
  onStatusChange, 
  searchTerm, 
  onSearchChange, 
  routes 
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <HiOutlineFilter className="mr-2" />
        Filters
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Route Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Route
        </label>
        <select
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Routes</option>
          {routes.map(route => (
            <option key={route.routeId} value={route.routeId}>
              {route.routeName} - {route.collectionDate}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="MISSED">Missed</option>
          <option value="SKIPPED">Skipped</option>
        </select>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  </div>
);

export default RouteStopsFilterBar;
