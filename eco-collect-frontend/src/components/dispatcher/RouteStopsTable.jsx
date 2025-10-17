import React, { useState } from 'react';
import { 
  formatStatus, 
  formatDate,
  formatTime, 
  STATUS_COLORS
} from '../../services/dispatcher/routeStopUtils';
import { mockBins, BIN_TYPE_COLORS } from '../../data/mockBinsData';
import SnackBar from '../common/SnackBar';
import {
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineMenu,
  HiOutlineCamera,
  HiOutlineEyeOff,
} from 'react-icons/hi';

// Helper function to get bin information from mockBinsData
const getBinInfo = (binId) => {
  return mockBins.find(bin => bin.bin_id === binId) || null;
};

const RouteStopRow = ({ stop, onView, onViewPhoto, onPhotoClick }) => {
  const binInfo = getBinInfo(stop.binId);
  
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <HiOutlineMenu className="text-gray-400 text-lg mr-2" />
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {stop.stopOrder || 'N/A'}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">Bin #{stop.binId}</span>
            {binInfo && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${BIN_TYPE_COLORS[binInfo.bin_type]}`}>
                {binInfo.bin_type}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600 flex items-center mb-1">
            <HiOutlineLocationMarker className="mr-1" />
            {binInfo ? binInfo.location : 'Location not found'}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        {stop.driverName ? (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{stop.driverName}</span>
            <span className="text-xs text-gray-500">ID: {stop.driverId}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Not assigned</span>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col text-sm text-gray-600">
          <span className="font-medium">
            {stop.collectionDate ? formatDate(stop.collectionDate) : 'N/A'}
          </span>
          {stop.collectionDate && (
            <span className="text-xs text-gray-500">
              {formatTime(stop.collectionDate)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[stop.status] || 'bg-gray-100 text-gray-800'}`}>
            {formatStatus(stop.status)}
          </span>
          {(stop.status === 'MISSED' || stop.status === 'SKIPPED') && stop.reasonCode && stop.reasonCode !== 'NONE' && (
            <span className="text-xs text-amber-600 mt-1 font-medium">
              Reason: {stop.reasonCode.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col text-sm">
          {stop.collected ? (
            <span className="text-emerald-600 font-medium flex items-center">
              <HiOutlineCheckCircle className="mr-1" />
              Yes ({stop.weightKg || 0} kg)
            </span>
          ) : (
            <span className="text-red-600 font-medium flex items-center">
              <HiOutlineXCircle className="mr-1" />
              No
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col text-sm text-gray-600">
          <span>ETA: {formatTime(stop.plannedEta)}</span>
          {stop.arrivedAt && (
            <span className="text-xs text-blue-600 mt-1">
              Arrived: {formatTime(stop.arrivedAt)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${
            stop.source === 'QR' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {stop.source || 'MANUAL'}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          {stop.photoUrl ? (
            <button
              onClick={() => onViewPhoto(stop)}
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
              title="View Photo"
            >
              <HiOutlineEye className="text-lg" />
              <span className="text-xs">View</span>
            </button>
          ) : (
            <button
              onClick={() => onPhotoClick(stop)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-1"
              title="No photo available"
            >
              <HiOutlineEyeOff className="text-lg" />
              <span className="text-xs">No Photo</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const RouteStopsTable = ({ stops, onView, onViewPhoto, selectedRoute }) => {
  const [snackBar, setSnackBar] = useState({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const handlePhotoClick = (stop) => {
    setSnackBar({
      isOpen: true,
      message: `The Collector hasn't assigned a Photo yet for Stop #${stop.stopId}`,
      type: 'warning'
    });
  };

  const handleCloseSnackBar = () => {
    setSnackBar(prev => ({ ...prev, isOpen: false }));
  };
  // Show empty state if no route is selected
  if (!selectedRoute) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <HiOutlineMap className="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select A Route to Start</h3>
        <p className="text-gray-500">Choose a route from the filter above to view and rearrange the stops</p>
      </div>
    );
  }

  // Show empty state if no stops
  if (stops.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <HiOutlineMap className="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Route Stops Found</h3>
        <p className="text-gray-500">No stops found for the selected route or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <HiOutlineMap className="mr-2" />
          Route Stops ({stops.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bin & Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Collection Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Collected</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Photo</th>
            </tr>
          </thead>
          <tbody>
            {stops.map(stop => (
              <RouteStopRow
                key={stop.stopId}
                stop={stop}
                onView={onView}
                onViewPhoto={onViewPhoto}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* SnackBar for photo notifications */}
      <SnackBar
        isOpen={snackBar.isOpen}
        onClose={handleCloseSnackBar}
        message={snackBar.message}
        type={snackBar.type}
        duration={4000}
      />
    </div>
  );
};

export default RouteStopsTable;
