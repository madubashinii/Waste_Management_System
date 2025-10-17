import React, { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiOutlineEye, HiOutlinePencil } from 'react-icons/hi';
import { getStatusBadgeClass } from './statusUtils';

const WardCard = ({ 
  ward, 
  isSelected, 
  isAvailable, 
  onToggle,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  conflictingRoute,
  collectionDate 
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => onMouseEnter(ward.wardId)}
      onMouseLeave={() => onMouseLeave()}
    >
      <button
        onClick={() => isAvailable && onToggle(ward)}
        disabled={!isAvailable}
        className={`w-full p-2 border rounded-md text-left transition-all ${
          !isAvailable
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            : isSelected
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-25'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium">Ward {ward.wardNumber}</p>
            <p className="text-xs text-gray-600">{ward.wardName}</p>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-1">
            {isAvailable ? (
              <HiOutlineCheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <HiOutlineExclamationCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Already assigned badge */}
        {!isAvailable && (
          <div className="mt-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Already Assigned
            </span>
          </div>
        )}
      </button>

      {/* Enhanced tooltip for unavailable wards */}
      {!isAvailable && isHovered && (
        <div className="absolute z-10 w-80 p-3 mt-1 text-xs text-white bg-gray-900 rounded-md shadow-lg">
          <div className="flex items-start space-x-2">
            <HiOutlineInformationCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Ward Already Assigned</p>
              <p className="mt-1 opacity-90">
                This ward is already assigned to another route on {collectionDate ? new Date(collectionDate).toLocaleDateString() : 'the selected date'}.
              </p>
              
              {/* Route details */}
              {conflictingRoute && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="font-medium text-emerald-300">Assigned to:</p>
                  <p className="opacity-90">{conflictingRoute.routeName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusBadgeClass(conflictingRoute.status)}`}>
                      {conflictingRoute.status?.toUpperCase()}
                    </span>
                    <span className="opacity-75">
                      {conflictingRoute.wardCount} ward(s)
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View route:', conflictingRoute);
                      }}
                      className="flex items-center px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <HiOutlineEye className="h-3 w-3 mr-1" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit route:', conflictingRoute);
                      }}
                      className="flex items-center px-2 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                    >
                      <HiOutlinePencil className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default WardCard;
