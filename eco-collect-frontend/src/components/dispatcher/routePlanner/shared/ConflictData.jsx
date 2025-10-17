import React from 'react';
import { HiOutlineExclamation, HiOutlineEye, HiOutlinePencil } from 'react-icons/hi';
import { formatRouteStatus } from './statusUtils';

const ConflictData = ({ 
  conflictingRoutes, 
  conflictingWards, 
  onViewRoute, 
  onEditRoute 
}) => {
  if (conflictingRoutes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <HiOutlineExclamation className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No conflicting routes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conflictingRoutes.map((route) => {
        const status = formatRouteStatus(route.status);
        const conflictingWardNumbers = route.wards
          ?.filter(ward => conflictingWards.some(cw => (cw.wardNumber || cw.id) === (ward.wardNumber || ward.id)))
          ?.map(ward => ward.wardNumber || ward.id) || [];

        return (
          <div key={route.routeId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{route.routeName}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Route ID: {route.routeId}</p>
                  <p>Collection Date: {new Date(route.collectionDate).toLocaleDateString()}</p>
                  <p>Total Wards: {route.wardCount}</p>
                  <p>Conflicting Wards: {conflictingWardNumbers.join(', ')}</p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onViewRoute(route)}
                  className="flex items-center px-3 py-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                >
                  <HiOutlineEye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button
                  onClick={() => onEditRoute(route)}
                  className="flex items-center px-3 py-1 text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors"
                >
                  <HiOutlinePencil className="h-3 w-3 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConflictData;
