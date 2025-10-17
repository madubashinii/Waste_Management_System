import React from 'react';
import { HiOutlineExclamation, HiOutlineCalendar, HiOutlineRefresh } from 'react-icons/hi';

const AllWardsAssignedDialog = ({ 
  isOpen, 
  onClose, 
  onSelectAlternativeDate,
  onViewConflicts,
  selectedDate,
  selectedZone,
  totalWards,
  assignedWards
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="flex-shrink-0">
            <HiOutlineExclamation className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Wards Assigned</h3>
            <p className="text-sm text-gray-600">No available wards for the selected date</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <div className="flex items-start space-x-3">
              <HiOutlineExclamation className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  All {totalWards} ward(s) in this zone are already assigned for {new Date(selectedDate).toLocaleDateString()}.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  You cannot create a new route with these wards on this date.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">What you can do:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choose a different date with available wards</li>
                <li>• Select a different zone</li>
                <li>• View and modify existing routes</li>
                <li>• Contact the dispatcher for route adjustments</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white border border-gray-200 rounded-md p-3">
                <div className="text-lg font-semibold text-gray-900">{totalWards}</div>
                <div className="text-xs text-gray-600">Total Wards</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-3">
                <div className="text-lg font-semibold text-red-600">{assignedWards}</div>
                <div className="text-xs text-gray-600">Assigned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onViewConflicts}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
            >
              <HiOutlineRefresh className="h-4 w-4 mr-2" />
              View Conflicts
            </button>
            <button
              onClick={onSelectAlternativeDate}
              className="flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-md hover:bg-emerald-200 transition-colors"
            >
              <HiOutlineCalendar className="h-4 w-4 mr-2" />
              Choose Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllWardsAssignedDialog;
