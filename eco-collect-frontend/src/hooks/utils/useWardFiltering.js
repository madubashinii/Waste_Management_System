import { useMemo } from 'react';
import { 
  getAvailableWardsForDate, 
  getAssignedWardNumbers, 
  isWardAvailable,
  sortWardsByNumber,
  filterWardsBySearch
} from '../../utils';

/**
 * Custom hook for ward filtering and sorting logic
 */
export const useWardFiltering = (zoneWards, assignedWards, filters) => {
  const { searchTerm, showOnlyAvailable, sortBy } = filters;

  // Get available wards for the selected zone and date
  const availableWards = useMemo(() => {
    if (!zoneWards.length || !assignedWards.length) return zoneWards;
    return getAvailableWardsForDate(zoneWards, assignedWards);
  }, [zoneWards, assignedWards]);

  // Get assigned ward numbers for quick lookup
  const assignedWardNumbers = useMemo(() => {
    return getAssignedWardNumbers(assignedWards);
  }, [assignedWards]);

  // Get ward statistics
  const wardStats = useMemo(() => {
    const total = zoneWards.length;
    const available = availableWards.length;
    const assigned = total - available;
    
    return {
      total,
      available,
      assigned,
      percentage: total > 0 ? Math.round((available / total) * 100) : 0
    };
  }, [zoneWards.length, availableWards.length]);

  // Get filtered and sorted ward list
  const filteredWards = useMemo(() => {
    let wards = showOnlyAvailable ? availableWards : zoneWards;
    
    // Apply search filter
    if (searchTerm) {
      wards = filterWardsBySearch(wards, searchTerm);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'wardName':
        wards = [...wards].sort((a, b) => 
          (a.wardName || '').localeCompare(b.wardName || '')
        );
        break;
      case 'availability':
        wards = [...wards].sort((a, b) => {
          const aAvailable = isWardAvailable(a, assignedWards);
          const bAvailable = isWardAvailable(b, assignedWards);
          return bAvailable - aAvailable; // Available first
        });
        break;
      case 'wardNumber':
      default:
        wards = sortWardsByNumber(wards);
        break;
    }
    
    return wards;
  }, [availableWards, zoneWards, searchTerm, showOnlyAvailable, sortBy, assignedWards]);

  // Check if a specific ward is available
  const checkWardAvailability = (ward) => {
    return isWardAvailable(ward, assignedWards);
  };

  // Get ward availability status
  const getWardStatus = (ward) => {
    const isAvailable = checkWardAvailability(ward);
    return {
      isAvailable,
      status: isAvailable ? 'available' : 'assigned',
      statusText: isAvailable ? 'Available' : 'Already Assigned',
      statusColor: isAvailable ? 'green' : 'red'
    };
  };

  return {
    availableWards,
    assignedWardNumbers,
    wardStats,
    filteredWards,
    checkWardAvailability,
    getWardStatus
  };
};
