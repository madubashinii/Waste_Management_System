import React from 'react';

const RouteSummaryStep = ({ 
  routeName, 
  collectionDate, 
  selectedZone, 
  selectedWards, 
  assignedTruck, 
  zones, 
  trucks 
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Route Summary</h3>
        <div className="space-y-2 text-xs">
          <div><span className="font-medium">Name:</span> {routeName}</div>
          <div><span className="font-medium">Date:</span> {collectionDate}</div>
          <div><span className="font-medium">Zone:</span> {zones.find(z => z.zoneId === parseInt(selectedZone))?.zoneName}</div>
          <div><span className="font-medium">Wards:</span> {selectedWards.length} ward(s)</div>
          {selectedWards.length > 0 && (
            <div className="ml-4 text-xs text-gray-600">
              {selectedWards.map((ward, index) => (
                <div key={ward.wardId}>
                  {index + 1}. Ward {ward.wardNumber} - {ward.wardName}
                </div>
              ))}
            </div>
          )}
          <div><span className="font-medium">Truck:</span> {trucks.find(t => t.truckId === parseInt(assignedTruck))?.truckName}</div>
        </div>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> A route will remain pending until a Collector is assigned. Once a Collector is assigned, the route status will automatically change to "in_progress."
        </p>
      </div>
    </div>
  );
};

export default RouteSummaryStep;
