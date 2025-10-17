import { useState, useEffect } from 'react';
import RouteStopsTable from '../../components/dispatcher/RouteStopsTable';
import RouteStopsFilterBar from '../../components/dispatcher/RouteStopsFilterBar';
import { mockBins, getBinByQrCode } from '../../data/mockBinsData';
import { routeStopService } from '../../services/dispatcher/routeStopService';
import { routeService } from '../../services/dispatcher/routeService';
import {
  formatStatus, 
  filterRouteStops
} from '../../services/dispatcher/routeStopUtils';

// Helper function to get bin information from mockBinsData
const getBinInfo = (binId) => {
  return mockBins.find(bin => bin.bin_id === binId) || null;
};

const RouteStops = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [routeStops, setRouteStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load routes and route stops on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load route stops when selected route changes
  useEffect(() => {
    if (selectedRoute) {
      loadRouteStops(selectedRoute);
    } else {
      loadAllRouteStops();
    }
  }, [selectedRoute]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadRoutes(), loadAllRouteStops()]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    try {
      const response = await routeService.getAllRoutes();
      if (response.success && response.data) {
        setRoutes(response.data);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadAllRouteStops = async () => {
    try {
      const response = await routeStopService.getAllRouteStops();
      if (response.success && response.data) {
        // Map backend data to frontend format (backend now returns DTO with proper structure)
        const mappedRouteStops = response.data.map(stop => ({
          stopId: stop.stopId,
          routeId: stop.routeId,
          collectionDate: stop.collectionDate,
          binId: stop.binId,
          driverId: stop.driverId,
          driverName: stop.driverName,
          residentId: stop.residentId,
          stopOrder: stop.stopOrder,
          collected: stop.collected || false,
          photoUrl: stop.photoUrl,
          plannedEta: stop.plannedEta,
          arrivedAt: stop.arrivedAt,
          status: stop.status || 'PENDING',
          reassignedToDriverId: stop.reassignedToDriverId,
          reasonCode: stop.reasonCode || 'NONE',
          source: stop.source || 'MANUAL',
          weightKg: stop.weightKg || 0,
          notes: stop.notes || 'Not collected yet',
          createdAt: stop.createdAt,
          updatedAt: stop.updatedAt
        }));
        setRouteStops(mappedRouteStops);
      }
    } catch (error) {
      console.error('Error loading route stops:', error);
      // Fallback to empty array if backend is not available
      setRouteStops([]);
    }
  };

  const loadRouteStops = async (routeId) => {
    try {
      const response = await routeStopService.getRouteStopsByRouteId(routeId);
      if (response.success && response.data) {
        // Map backend data to frontend format (backend now returns DTO with proper structure)
        const mappedRouteStops = response.data.map(stop => ({
          stopId: stop.stopId,
          routeId: stop.routeId,
          collectionDate: stop.collectionDate,
          binId: stop.binId,
          driverId: stop.driverId,
          driverName: stop.driverName,
          residentId: stop.residentId,
          stopOrder: stop.stopOrder,
          collected: stop.collected || false,
          photoUrl: stop.photoUrl,
          plannedEta: stop.plannedEta,
          arrivedAt: stop.arrivedAt,
          status: stop.status || 'PENDING',
          reassignedToDriverId: stop.reassignedToDriverId,
          reasonCode: stop.reasonCode || 'NONE',
          source: stop.source || 'MANUAL',
          weightKg: stop.weightKg || 0,
          notes: stop.notes || 'Not collected yet',
          createdAt: stop.createdAt,
          updatedAt: stop.updatedAt
        }));
        setRouteStops(mappedRouteStops);
      }
    } catch (error) {
      console.error('Error loading route stops for route:', error);
    }
  };

  // Filter route stops using utility function
  const filteredStops = filterRouteStops(routeStops, {
    routeId: selectedRoute ? parseInt(selectedRoute) : undefined,
    status: statusFilter || undefined,
    search: searchTerm || undefined
  });

  const handleView = (stop) => {
    const binInfo = getBinInfo(stop.binId);
    alert(`Viewing details for Stop #${stop.stopId}\nLocation: ${binInfo?.location || 'N/A'}\nStatus: ${formatStatus(stop.status)}`);
  };

  const handleViewPhoto = (stop) => {
    if (stop.photoUrl) {
      // Open photo in a new window/tab
      window.open(stop.photoUrl, '_blank');
    } else {
      alert('No photo available for this stop');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading route stops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Route Stops</h1>
                <p className="mt-2 text-gray-600">
                  Manage and monitor route stops for waste collection
                </p>
            </div>
            </div>
          </div>

          {/* Filter Bar */}
          <RouteStopsFilterBar
            selectedRoute={selectedRoute}
            onRouteChange={setSelectedRoute}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            routes={routes}
          />

          {/* Route Stops Table */}
          <RouteStopsTable
            stops={filteredStops}
            onView={handleView}
            onViewPhoto={handleViewPhoto}
            selectedRoute={selectedRoute}
          />
    </>
  );
};

export default RouteStops;