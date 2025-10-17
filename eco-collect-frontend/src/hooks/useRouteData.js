import { useState, useEffect } from 'react';
import { useDataLoader } from './utils';
import { RouteDataService } from './services/routeDataService';

export const useRouteData = () => {
  // Data loaders for different data types
  const zonesLoader = useDataLoader();
  const trucksLoader = useDataLoader();
  const wardsLoader = useDataLoader();
  const routesLoader = useDataLoader();
  const assignedWardsLoader = useDataLoader();
  
  // Combined loading state
  const [loading, setLoading] = useState(true);

  // Load all initial data
  const loadData = async (onError) => {
    try {
      setLoading(true);
      
      await Promise.all([
        zonesLoader.loadData(() => RouteDataService.loadZones()),
        trucksLoader.loadData(() => RouteDataService.loadTrucks()),
        wardsLoader.loadData(() => RouteDataService.loadWards()),
        routesLoader.loadData(() => RouteDataService.loadRoutes())
      ]);
      
    } catch (error) {
      console.error('Error loading data:', error);
      onError?.('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load routes specifically
  const loadRoutes = async (onError) => {
    try {
      await routesLoader.loadData(() => RouteDataService.loadRoutes());
    } catch (error) {
      console.error('Error loading routes:', error);
      onError?.('Failed to load routes');
    }
  };

  // Refresh data function
  const refreshData = async (onError) => {
    await loadData(onError);
  };

  // Load assigned wards for a specific date
  const loadAssignedWardsForDate = async (date, onError) => {
    try {
      const data = await assignedWardsLoader.loadData(
        () => RouteDataService.loadAssignedWardsForDate(date)
      );
      return data;
    } catch (error) {
      console.error('Error loading assigned wards:', error);
      onError?.('Failed to load assigned wards for the selected date');
      return [];
    }
  };

  // Get available wards for a specific zone and date
  const getAvailableWards = (zoneId, date) => {
    return RouteDataService.getAvailableWards(zoneId, wardsLoader.data, assignedWardsLoader.data);
  };

  // Get available wards for a specific zone with assigned wards data passed directly
  const getAvailableWardsWithAssigned = (zoneId, assignedWards) => {
    return RouteDataService.getAvailableWards(zoneId, wardsLoader.data, assignedWards);
  };

  // Get filtered data
  const getZoneWards = (zoneId) => {
    return RouteDataService.getZoneWards(zoneId, wardsLoader.data);
  };

  const getActiveTrucks = () => {
    return RouteDataService.getActiveTrucks(trucksLoader.data);
  };

  const getRouteStats = () => {
    return RouteDataService.getRouteStats(routesLoader.data);
  };

  // Load data on mount
  useEffect(() => {
    const handleError = (message) => {
      console.error('Data loading error:', message);
    };
    loadData(handleError);
  }, []);

  return {
    // Data
    zones: zonesLoader.data,
    trucks: trucksLoader.data,
    wards: wardsLoader.data,
    routes: routesLoader.data,
    assignedWardsOnDate: assignedWardsLoader.data,
    
    // Loading states
    loading,
    routesLoading: routesLoader.loading,
    assignedWardsLoading: assignedWardsLoader.loading,
    
    // Functions
    loadData,
    loadRoutes,
    refreshData,
    loadAssignedWardsForDate,
    getAvailableWards,
    getAvailableWardsWithAssigned,
    getZoneWards,
    getActiveTrucks,
    getRouteStats
  };
};
