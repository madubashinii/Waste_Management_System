import React, { useState } from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';
import { BaseModal, ConflictData, AlternativeDates } from './shared';
import { useConflictData } from './hooks/useConflictData';

const RouteConflictModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedZone, 
  conflictingWards = [],
  onDateChange,
  onViewRoute,
  onEditRoute
}) => {
  const [activeTab, setActiveTab] = useState('conflicts');
  const { conflictingRoutes, alternativeDates, loading } = useConflictData(
    selectedDate, 
    selectedZone, 
    conflictingWards, 
    isOpen
  );

  const handleDateSelect = (date) => {
    onDateChange(date);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ward Assignment Conflicts"
      icon={HiOutlineExclamation}
      iconColor="text-amber-600"
      maxWidth="max-w-4xl"
    >
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {conflictingWards.length} ward(s) already assigned on {new Date(selectedDate).toLocaleDateString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conflicts'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Conflicting Routes ({conflictingRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('alternatives')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alternatives'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Alternative Dates ({alternativeDates.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-96">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">Loading conflict data...</span>
          </div>
        ) : (
          <>
            {activeTab === 'conflicts' && (
              <ConflictData
                conflictingRoutes={conflictingRoutes}
                conflictingWards={conflictingWards}
                onViewRoute={onViewRoute}
                onEditRoute={onEditRoute}
              />
            )}
            {activeTab === 'alternatives' && (
              <AlternativeDates
                alternativeDates={alternativeDates}
                onDateSelect={handleDateSelect}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {activeTab === 'conflicts' 
            ? 'Review conflicting routes and consider editing them or choosing alternative dates.'
            : 'Select an alternative date with available wards for your route.'
          }
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {activeTab === 'alternatives' && alternativeDates.length > 0 && (
            <button
              onClick={() => setActiveTab('conflicts')}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-md hover:bg-emerald-200 transition-colors"
            >
              View Conflicts
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default RouteConflictModal;
