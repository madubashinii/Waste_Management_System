import React from 'react';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import { WardCard } from '../shared';
import { useWardSelection } from '../hooks/useWardSelection';

const WardSelectionStep = ({ 
  zoneWards, 
  selectedWards, 
  handleWardToggle,
  getAvailableWards,
  collectionDate,
  selectedZone,
  assignedWardsOnDate = []
}) => {
  const {
    hoveredWard,
    setHoveredWard,
    conflictingRoutes,
    loadingConflicts,
    showAllWards,
    setShowAllWards,
    availableWards,
    displayWards,
    getWardStatus,
    getRouteForWard
  } = useWardSelection(
    zoneWards,
    selectedWards,
    handleWardToggle,
    getAvailableWards,
    collectionDate,
    selectedZone,
    assignedWardsOnDate
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {showAllWards ? 'All Wards' : 'Available Wards'}
        </h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center text-xs text-gray-600">
            <input
              type="checkbox"
              checked={showAllWards}
              onChange={(e) => setShowAllWards(e.target.checked)}
              className="mr-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Show all wards
          </label>
        </div>
      </div>

      {/* Ward availability summary */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">Available ({availableWards.length})</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-gray-600">Assigned ({zoneWards.length - availableWards.length})</span>
            </div>
            {loadingConflicts && (
              <div className="flex items-center space-x-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-emerald-600"></div>
                <span className="text-gray-500">Loading conflicts...</span>
              </div>
            )}
          </div>
          <div className="text-gray-500">
            Total: {zoneWards.length} wards
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {displayWards.map(ward => {
          const status = getWardStatus(ward);
          const isSelected = selectedWards.some(w => w.wardId === ward.wardId);
          const isHovered = hoveredWard === ward.wardId;
          const conflictingRoute = getRouteForWard(ward);

          return (
            <WardCard
              key={ward.wardId}
              ward={ward}
              isSelected={isSelected}
              isAvailable={status.isAvailable}
              onToggle={handleWardToggle}
              onMouseEnter={setHoveredWard}
              onMouseLeave={() => setHoveredWard(null)}
              isHovered={isHovered}
              conflictingRoute={conflictingRoute}
              collectionDate={collectionDate}
            />
          );
        })}
      </div>

      {/* No wards message */}
      {displayWards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <HiOutlineExclamationCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">
            {showAllWards ? 'No wards found in this zone.' : 'No available wards for the selected date.'}
          </p>
        </div>
      )}

      {/* Selection summary */}
      {selectedWards.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HiOutlineCheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Selected: {selectedWards.length} ward(s)
              </span>
            </div>
            <div className="text-xs text-emerald-600">
              {selectedWards.map(w => w.wardNumber).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Warning if no available wards */}
      {availableWards.length === 0 && zoneWards.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <HiOutlineExclamationCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                No Available Wards
              </p>
              <p className="text-xs text-amber-700 mt-1">
                All wards in this zone are already assigned for the selected date. 
                Please choose a different date or zone.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardSelectionStep;
