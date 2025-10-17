import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineEye } from 'react-icons/hi';
import RouteConflictModal from '../RouteConflictModal';
import AllWardsAssignedDialog from '../AllWardsAssignedDialog';

const DateZoneStep = ({ 
  collectionDate, 
  setCollectionDate, 
  selectedZone, 
  setSelectedZone, 
  zones,
  loadAssignedWardsForDate,
  getAvailableWardsWithAssigned,
  assignedWardsLoading,
  onError
}) => {
  const [wardAvailabilityInfo, setWardAvailabilityInfo] = useState({
    totalWards: 0,
    availableWards: 0,
    assignedWards: 0,
    isLoading: false,
    hasChecked: false
  });

  // Modal states
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showAllWardsAssignedDialog, setShowAllWardsAssignedDialog] = useState(false);
  const [conflictingWards, setConflictingWards] = useState([]);

  // Ref to track timeout for debouncing
  const timeoutRef = useRef(null);
  
  // Ref to track last checked values to prevent unnecessary API calls
  const lastCheckedRef = useRef({ date: null, zone: null });

  // Check ward availability when date or zone changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the API call
    timeoutRef.current = setTimeout(async () => {
      const checkWardAvailability = async () => {
        if (!collectionDate || !selectedZone) {
          setWardAvailabilityInfo({
            totalWards: 0,
            availableWards: 0,
            assignedWards: 0,
            isLoading: false,
            hasChecked: false
          });
          return;
        }

        // Check if we've already checked this combination
        if (lastCheckedRef.current.date === collectionDate && 
            lastCheckedRef.current.zone === selectedZone) {
          return;
        }

        // Prevent multiple simultaneous calls
        if (wardAvailabilityInfo.isLoading) {
          return;
        }

      try {
        setWardAvailabilityInfo(prev => ({ ...prev, isLoading: true }));
        
        // Load assigned wards for the date
        const assignedWards = await loadAssignedWardsForDate(collectionDate, (error) => {
          // Only show error if it's not about endpoint not being implemented
          if (!error.includes('endpoint not implemented')) {
            onError(error);
          }
        });
        
        // Get available wards for the zone and date using the returned data
        const availableWards = getAvailableWardsWithAssigned(selectedZone, assignedWards);
        
        // Get total wards in the zone
        const selectedZoneData = zones.find(zone => zone.zoneId === parseInt(selectedZone));
        const allZoneWards = selectedZoneData?.wards || [];
        const totalWards = allZoneWards.length;
        
        setWardAvailabilityInfo({
          totalWards,
          availableWards: availableWards.length,
          assignedWards: totalWards - availableWards.length,
          isLoading: false,
          hasChecked: true
        });

        // Update last checked values
        lastCheckedRef.current = { date: collectionDate, zone: selectedZone };

        // Set conflicting wards for modal
        const conflicting = allZoneWards.filter(ward => !availableWards.some(aw => aw.wardId === ward.wardId));
        setConflictingWards(conflicting);
      } catch (error) {
        console.error('Error checking ward availability:', error);
        setWardAvailabilityInfo(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkWardAvailability();
    }, 300); // 300ms debounce

    // Cleanup function to prevent memory leaks
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [collectionDate, selectedZone, zones]);

  const getAvailabilityMessage = () => {
    if (!wardAvailabilityInfo.hasChecked) return null;
    
    if (wardAvailabilityInfo.availableWards === 0) {
      return {
        type: 'warning',
        icon: HiOutlineExclamation,
        message: 'No wards available for the selected date. All wards in this zone are already assigned.',
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      };
    } else if (wardAvailabilityInfo.assignedWards > 0) {
      return {
        type: 'info',
        icon: HiOutlineInformationCircle,
        message: `${wardAvailabilityInfo.assignedWards} ward(s) already assigned on this date. ${wardAvailabilityInfo.availableWards} ward(s) available.`,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    } else {
      return {
        type: 'success',
        icon: HiOutlineCheckCircle,
        message: `All ${wardAvailabilityInfo.availableWards} ward(s) in this zone are available for the selected date.`,
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }
  };

  const availabilityMessage = getAvailabilityMessage();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Collection Date *</label>
        <input
          type="date"
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {collectionDate && (
          <p className="mt-1 text-xs text-gray-500">
            Selected date: {new Date(collectionDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Zone *</label>
        <div className="flex gap-2">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select a zone...</option>
            {zones.map(zone => (
              <option key={zone.zoneId} value={zone.zoneId}>{zone.zoneName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading indicator */}
      {(assignedWardsLoading || wardAvailabilityInfo.isLoading) && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
          <span>Checking ward availability...</span>
        </div>
      )}


      {/* Modals */}
      <RouteConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        selectedDate={collectionDate}
        selectedZone={selectedZone}
        conflictingWards={conflictingWards}
        onDateChange={(newDate) => {
          setCollectionDate(newDate);
          setShowConflictModal(false);
        }}
        onViewRoute={(route) => {
          console.log('View route:', route);
          // Implement route viewing logic
        }}
        onEditRoute={(route) => {
          console.log('Edit route:', route);
          // Implement route editing logic
        }}
      />

      <AllWardsAssignedDialog
        isOpen={showAllWardsAssignedDialog}
        onClose={() => setShowAllWardsAssignedDialog(false)}
        onSelectAlternativeDate={() => {
          setShowAllWardsAssignedDialog(false);
          setShowConflictModal(true);
        }}
        onViewConflicts={() => {
          setShowAllWardsAssignedDialog(false);
          setShowConflictModal(true);
        }}
        selectedDate={collectionDate}
        selectedZone={selectedZone}
        totalWards={wardAvailabilityInfo.totalWards}
        assignedWards={wardAvailabilityInfo.assignedWards}
      />
    </div>
  );
};

export default DateZoneStep;
