/**
 * Ward Utility Functions
 * 
 * This module provides utility functions for ward management operations,
 * particularly for filtering and processing ward data in the route planning system.
 */

/**
 * Get available wards for a specific date by filtering out already assigned wards
 * 
 * @param {Array} zoneWards - Array of wards available in a zone
 * @param {Array} assignedWards - Array of wards already assigned on the date
 * @returns {Array} Array of available wards that are not yet assigned
 * 
 * @example
 * const zoneWards = [
 *   { id: 1, wardNumber: 'W001', wardName: 'Ward 1' },
 *   { id: 2, wardNumber: 'W002', wardName: 'Ward 2' },
 *   { id: 3, wardNumber: 'W003', wardName: 'Ward 3' }
 * ];
 * 
 * const assignedWards = [
 *   { wardNumber: 'W001', wardName: 'Ward 1' },
 *   { wardNumber: 'W003', wardName: 'Ward 3' }
 * ];
 * 
 * const availableWards = getAvailableWardsForDate(zoneWards, assignedWards);
 * // Returns: [{ id: 2, wardNumber: 'W002', wardName: 'Ward 2' }]
 */
export const getAvailableWardsForDate = (zoneWards, assignedWards) => {
  // Input validation
  if (!Array.isArray(zoneWards)) {
    console.warn('getAvailableWardsForDate: zoneWards must be an array');
    return [];
  }
  
  if (!Array.isArray(assignedWards)) {
    console.warn('getAvailableWardsForDate: assignedWards must be an array');
    return zoneWards; // If no assigned wards, return all zone wards
  }

  // Create a Set of assigned ward numbers for efficient lookup
  const assignedWardNumbers = new Set(
    assignedWards.map(ward => ward.wardNumber || ward.id)
  );

  // Filter out assigned wards from zone wards
  const availableWards = zoneWards.filter(ward => {
    const wardIdentifier = ward.wardNumber || ward.id;
    return !assignedWardNumbers.has(wardIdentifier);
  });

  return availableWards;
};

/**
 * Get assigned wards for a specific date by ward number
 * 
 * @param {Array} assignedWards - Array of assigned wards
 * @returns {Set} Set of assigned ward numbers
 */
export const getAssignedWardNumbers = (assignedWards) => {
  if (!Array.isArray(assignedWards)) {
    return new Set();
  }
  
  return new Set(
    assignedWards.map(ward => ward.wardNumber || ward.id)
  );
};

/**
 * Check if a ward is available for assignment on a specific date
 * 
 * @param {Object} ward - The ward to check
 * @param {Array} assignedWards - Array of already assigned wards
 * @returns {boolean} True if ward is available, false otherwise
 */
export const isWardAvailable = (ward, assignedWards) => {
  if (!ward) return false;
  
  const assignedWardNumbers = getAssignedWardNumbers(assignedWards);
  const wardIdentifier = ward.wardNumber || ward.id;
  
  return !assignedWardNumbers.has(wardIdentifier);
};

/**
 * Get ward statistics for a zone on a specific date
 * 
 * @param {Array} zoneWards - Array of all wards in the zone
 * @param {Array} assignedWards - Array of assigned wards for the date
 * @returns {Object} Statistics object with counts and percentages
 */
export const getWardStatistics = (zoneWards, assignedWards) => {
  const totalWards = zoneWards.length;
  const assignedCount = assignedWards.length;
  const availableCount = totalWards - assignedCount;
  
  return {
    total: totalWards,
    assigned: assignedCount,
    available: availableCount,
    assignedPercentage: totalWards > 0 ? Math.round((assignedCount / totalWards) * 100) : 0,
    availablePercentage: totalWards > 0 ? Math.round((availableCount / totalWards) * 100) : 0
  };
};

/**
 * Sort wards by ward number for consistent ordering
 * 
 * @param {Array} wards - Array of wards to sort
 * @returns {Array} Sorted array of wards
 */
export const sortWardsByNumber = (wards) => {
  if (!Array.isArray(wards)) {
    return [];
  }
  
  return [...wards].sort((a, b) => {
    const aNumber = a.wardNumber || a.id || '';
    const bNumber = b.wardNumber || b.id || '';
    return aNumber.localeCompare(bNumber, undefined, { numeric: true });
  });
};

/**
 * Filter wards by search term (searches ward number and name)
 * 
 * @param {Array} wards - Array of wards to filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered array of wards
 */
export const filterWardsBySearch = (wards, searchTerm) => {
  if (!Array.isArray(wards) || !searchTerm) {
    return wards || [];
  }
  
  const term = searchTerm.toLowerCase();
  
  return wards.filter(ward => {
    const wardNumber = (ward.wardNumber || '').toLowerCase();
    const wardName = (ward.wardName || '').toLowerCase();
    
    return wardNumber.includes(term) || wardName.includes(term);
  });
};

// Export all utility functions as default object for convenience
export default {
  getAvailableWardsForDate,
  getAssignedWardNumbers,
  isWardAvailable,
  getWardStatistics,
  sortWardsByNumber,
  filterWardsBySearch
};
