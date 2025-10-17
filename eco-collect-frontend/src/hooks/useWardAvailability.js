import { useState, useEffect, useMemo } from 'react';
import { useDataLoader, useWardFiltering } from './utils';
import { RouteDataService } from './services/routeDataService';

/**
 * Custom hook for managing ward availability logic
 * 
 * This hook provides comprehensive ward availability management including:
 * - Loading assigned wards for specific dates
 * - Filtering available wards by zone and date
 * - Managing search and filter states
 * - Providing ward statistics and availability status
 * 
 * @param {Array} allWards - All wards from the system
 * @param {Function} onError - Error callback function
 * @returns {Object} Ward availability state and functions
 */
export const useWardAvailability = (allWards = [], onError) => {
  // Core state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [sortBy, setSortBy] = useState('wardNumber');

  // Data loader for assigned wards
  const assignedWardsLoader = useDataLoader();

  // Get wards for the selected zone
  const zoneWards = useMemo(() => {
    if (!selectedZoneId) return [];
    return allWards.filter(ward => ward.zoneId === parseInt(selectedZoneId));
  }, [allWards, selectedZoneId]);

  // Ward filtering logic
  const wardFiltering = useWardFiltering(zoneWards, assignedWardsLoader.data, {
    searchTerm,
    showOnlyAvailable,
    sortBy
  });

  // Load assigned wards for a specific date
  const loadAssignedWards = async (date) => {
    if (!date) {
      assignedWardsLoader.clearData();
      return;
    }

    try {
      await assignedWardsLoader.loadData(
        () => RouteDataService.loadAssignedWardsForDate(date),
        null,
        (error) => onError?.(error)
      );
    } catch (error) {
      console.error('Error loading assigned wards:', error);
      onError?.('Failed to load assigned wards for the selected date');
    }
  };

  // Refresh assigned wards for current date
  const refreshAssignedWards = async () => {
    if (selectedDate) {
      await loadAssignedWards(selectedDate);
    }
  };

  // Clear all filters and search
  const clearFilters = () => {
    setSearchTerm('');
    setShowOnlyAvailable(true);
    setSortBy('wardNumber');
  };

  // Reset the hook state
  const reset = () => {
    assignedWardsLoader.clearData();
    setSelectedDate('');
    setSelectedZoneId('');
    clearFilters();
    setInitialLoad(false);
  };

  // Load assigned wards when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAssignedWards(selectedDate);
      setInitialLoad(true);
    } else {
      assignedWardsLoader.clearData();
      setInitialLoad(false);
    }
  }, [selectedDate]);

  // Auto-refresh when zone changes (if date is selected)
  useEffect(() => {
    if (selectedDate && selectedZoneId && initialLoad) {
      // Small delay to prevent excessive API calls
      const timeoutId = setTimeout(() => {
        refreshAssignedWards();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedZoneId]);

  return {
    // Core state
    assignedWards: assignedWardsLoader.data,
    selectedDate,
    selectedZoneId,
    
    // Filter and search state
    searchTerm,
    showOnlyAvailable,
    sortBy,
    
    // Loading states
    loading: assignedWardsLoader.loading,
    initialLoad,
    
    // Computed data from ward filtering
    zoneWards,
    availableWards: wardFiltering.availableWards,
    assignedWardNumbers: wardFiltering.assignedWardNumbers,
    filteredWards: wardFiltering.filteredWards,
    wardStats: wardFiltering.wardStats,
    
    // State setters
    setSelectedDate,
    setSelectedZoneId,
    setSearchTerm,
    setShowOnlyAvailable,
    setSortBy,
    
    // Functions
    loadAssignedWards,
    refreshAssignedWards,
    checkWardAvailability: wardFiltering.checkWardAvailability,
    getWardStatus: wardFiltering.getWardStatus,
    clearFilters,
    reset,
    
    // Utility functions
    isWardAvailable: wardFiltering.checkWardAvailability,
    getAvailableWardsForZone: (zoneId) => {
      const zoneWards = allWards.filter(ward => ward.zoneId === parseInt(zoneId));
      return RouteDataService.getAvailableWards(zoneId, zoneWards, assignedWardsLoader.data);
    }
  };
};
