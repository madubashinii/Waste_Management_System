import React from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const WardForm = ({ 
  wards, 
  onAddWard, 
  onRemoveWard, 
  onUpdateWard,
  validateWard 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wards</h3>
        <button
          onClick={onAddWard}
          className="flex items-center px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <HiOutlinePlus className="mr-1" />
          Add Ward
        </button>
      </div>

      <div className="space-y-4 max-h-60 overflow-y-auto">
        {wards.map((ward, index) => {
          const validationError = validateWard ? validateWard(ward, index, wards) : null;
          
          return (
            <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number *</label>
                <input
                  type="number"
                  value={ward.wardNumber}
                  onChange={(e) => onUpdateWard(index, 'wardNumber', e.target.value)}
                  placeholder="e.g., 1"
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    validationError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="flex-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name *</label>
                <input
                  type="text"
                  value={ward.wardName}
                  onChange={(e) => onUpdateWard(index, 'wardName', e.target.value)}
                  placeholder="e.g., Mattakkuliya"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    validationError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {wards.length > 1 && (
                <button
                  onClick={() => onRemoveWard(index)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              )}
              {validationError && (
                <div className="text-xs text-red-600 mt-1 col-span-2">
                  {validationError}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WardForm;
