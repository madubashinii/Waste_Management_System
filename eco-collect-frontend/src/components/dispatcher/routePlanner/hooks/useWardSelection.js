import { useState, useEffect } from 'react';
import { routeService } from '../../../../services/dispatcher';
import { formatWardStatus } from '../shared/statusUtils';

export const useWardSelection = (
  zoneWards,
  selectedWards,
  handleWardToggle,
  getAvailableWards,
  collectionDate,
  selectedZone,
  assignedWardsOnDate = []
) => {
  const [hoveredWard, setHoveredWard] = useState(null);
  const [conflictingRoutes, setConflictingRoutes] = useState([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);
  const [showAllWards, setShowAllWards] = useState(false);

  // Get available wards for the selected zone and date
  const availableWards = getAvailableWards ? getAvailableWards(selectedZone, collectionDate) : zoneWards;
  
  // Create a set of assigned ward numbers for quick lookup
  const assignedWardNumbers = new Set(assignedWardsOnDate.map(ward => ward.wardNumber || ward.id));

  // Filter wards to show only available ones by default, but allow toggling
  const displayWards = showAllWards ? zoneWards : availableWards;

  // Load conflicting routes when date and zone are available
  useEffect(() => {
    const loadConflictingRoutes = async () => {
      if (!collectionDate || !selectedZone || assignedWardsOnDate.length === 0) {
        setConflictingRoutes([]);
        return;
      }

      try {
        setLoadingConflicts(true);
        const wardNumbers = assignedWardsOnDate.map(ward => ward.wardNumber || ward.id);
        const response = await routeService.getRoutesUsingWardsOnDate(collectionDate, wardNumbers);
        
        if (response.success) {
          setConflictingRoutes(response.data || []);
        }
      } catch (error) {
        console.error('Error loading conflicting routes:', error);
        setConflictingRoutes([]);
      } finally {
        setLoadingConflicts(false);
      }
    };

    loadConflictingRoutes();
  }, [collectionDate, selectedZone, assignedWardsOnDate]);

  // Get ward status information
  const getWardStatus = (ward) => {
    return formatWardStatus(ward, assignedWardNumbers);
  };

  // Get route details for a specific ward
  const getRouteForWard = (ward) => {
    const wardIdentifier = ward.wardNumber || ward.id;
    return conflictingRoutes.find(route => 
      route.wards?.some(routeWard => (routeWard.wardNumber || routeWard.id) === wardIdentifier)
    );
  };

  return {
    hoveredWard,
    setHoveredWard,
    conflictingRoutes,
    loadingConflicts,
    showAllWards,
    setShowAllWards,
    availableWards,
    displayWards,
    assignedWardNumbers,
    getWardStatus,
    getRouteForWard
  };
};
