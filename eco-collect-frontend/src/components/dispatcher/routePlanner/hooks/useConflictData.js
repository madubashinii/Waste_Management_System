import { useState, useEffect } from 'react';
import { routeService } from '../../../../services/dispatcher';

export const useConflictData = (selectedDate, selectedZone, conflictingWards, isOpen) => {
  const [conflictingRoutes, setConflictingRoutes] = useState([]);
  const [alternativeDates, setAlternativeDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedDate && selectedZone) {
      loadConflictData();
    }
  }, [isOpen, selectedDate, selectedZone, conflictingWards]);

  const loadConflictData = async () => {
    setLoading(true);
    try {
      // Load conflicting routes
      const wardNumbers = conflictingWards.map(ward => ward.wardNumber || ward.id);
      const routesResponse = await routeService.getRoutesUsingWardsOnDate(selectedDate, wardNumbers);
      
      if (routesResponse.success) {
        setConflictingRoutes(routesResponse.data || []);
      }

      // Load alternative dates
      const alternativesResponse = await routeService.getAlternativeDatesWithAvailableWards(
        selectedZone, 
        selectedDate, 
        7
      );
      
      if (alternativesResponse.success) {
        setAlternativeDates(alternativesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading conflict data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    conflictingRoutes,
    alternativeDates,
    loading
  };
};
