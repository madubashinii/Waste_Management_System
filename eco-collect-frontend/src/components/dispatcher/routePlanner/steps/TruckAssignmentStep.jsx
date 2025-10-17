import React from 'react';

const TruckAssignmentStep = ({ 
  assignedTruck, 
  setAssignedTruck, 
  getActiveTrucks, 
  trucks 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Truck *</label>
        <select
          value={assignedTruck}
          onChange={(e) => setAssignedTruck(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select a truck...</option>
          {getActiveTrucks().map(truck => (
            <option key={truck.truckId} value={truck.truckId}>
              {truck.truckName} - {truck.truckType}
            </option>
          ))}
        </select>
      </div>
      {assignedTruck && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
          <p className="text-sm text-emerald-800">
            Assigned: {trucks.find(t => t.truckId === parseInt(assignedTruck))?.truckName}
          </p>
        </div>
      )}
    </div>
  );
};

export default TruckAssignmentStep;
