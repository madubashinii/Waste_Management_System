import React from 'react';

const RouteNameStep = ({ routeName, setRouteName }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Route Name *</label>
        <input
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="e.g., Monday Morning Collection Route"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
    </div>
  );
};

export default RouteNameStep;
