import { useState, useEffect } from 'react';
import {
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineMap,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { routeService } from '../../services/dispatcher/routeService';
import { routeWardService } from '../../services/dispatcher/routeWardService';
import AssignCollectorTruckModal from './AssignCollectorTruckModal';

// Status colors for route status badges
const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  // Legacy support for assignment status
  unassigned: 'bg-red-100 text-red-800',
  assigned: 'bg-blue-100 text-blue-800',
};

// Helper function to determine assignment status
const getAssignmentStatus = (route) => {
  if (route.collectorId && route.truckId) {
    return 'assigned';
  } else if (route.truckId && !route.collectorId) {
    return 'truck_assigned';
  }
  return 'unassigned';
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Individual Route Card Component
const RouteCard = ({ route, onAssign }) => {
  const assignmentStatus = getAssignmentStatus(route);
  const displayStatus = route.status || (assignmentStatus === 'truck_assigned' ? 'unassigned' : assignmentStatus);
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      assignmentStatus === 'unassigned' ? 'border-red-600' : 'border-emerald-600'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{route.routeName}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[displayStatus] || 'bg-gray-100 text-gray-800'}`}>
              {displayStatus.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <HiOutlineLocationMarker className="mr-2 text-emerald-600" />
              <span>{route.zoneName || 'Unknown Zone'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <HiOutlineCalendar className="mr-2 text-emerald-600" />
              <span>{formatDate(route.collectionDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <HiOutlineMap className="mr-2 text-emerald-600" />
              <span>{route.stops || 0} stops</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <HiOutlineTrash className="mr-2 text-emerald-600" />
              <span>Mixed Waste</span>
            </div>
          </div>

          {/* Wards Information */}
          {route.wards && route.wards.length > 0 && (
            <div className="mt-2 p-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Wards ({route.wards.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {route.wards.slice(0, 6).map((ward, index) => (
                  <span
                    key={ward.wardId || index}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600"
                  >
                    {ward.wardName || `Ward ${ward.wardNumber || index + 1}`}
                  </span>
                ))}
                {route.wards.length > 6 && (
                  <span className="px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs text-gray-500">
                    +{route.wards.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {assignmentStatus === 'assigned' && (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-emerald-800">
                  <HiOutlineUserGroup className="mr-2" />
                  <span className="font-medium">{route.collectorName || 'Unknown Collector'}</span>
                </div>
                <div className="flex items-center text-emerald-800">
                  <HiOutlineTruck className="mr-2" />
                  <span className="font-medium">{route.truckName || 'Unknown Truck'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onAssign(route)}
        disabled={route.status === 'completed'}
        className={`w-full py-1.5 px-3 rounded-lg font-semibold transition-colors ${
          route.status === 'completed'
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : assignmentStatus === 'unassigned'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {route.status === 'completed' 
          ? 'Completed - Cannot Assign' 
          : assignmentStatus === 'unassigned' 
          ? 'Assign Collector & Truck' 
          : assignmentStatus === 'truck_assigned'
          ? 'Assign Collector & Reassign Truck'
          : 'Reassign'}
      </button>
    </div>
  );
};


// Helper function to enrich route data with ward information
const enrichRouteData = async (routes) => {
  const enrichedRoutes = await Promise.all(
    routes.map(async (route) => {
      try {
        // Fetch route wards for this route
        const routeWardsResponse = await routeWardService.getRouteWardsByRouteId(route.routeId);
        
        // Handle ApiResponse structure: { success: boolean, message: string, data: T }
        let routeWards = [];
        if (routeWardsResponse) {
          if (routeWardsResponse.success && routeWardsResponse.data) {
            // ApiResponse structure
            routeWards = routeWardsResponse.data;
          } else if (Array.isArray(routeWardsResponse)) {
            // Direct array response (fallback)
            routeWards = routeWardsResponse;
          } else if (routeWardsResponse.data) {
            // Another possible structure
            routeWards = routeWardsResponse.data;
          }
        }
        
        
        return {
          ...route,
          stops: routeWards.length,
          wards: routeWards
        };
      } catch (error) {
        return {
          ...route,
          stops: 0,
          wards: []
        };
      }
    })
  );
  
  return enrichedRoutes;
};

// Main Published Routes Card Component
const PublishedRoutesCard = ({ onAssignRoute, filters = {} }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch routes from backend
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let routesData;
      
      // Apply filters if provided
      if (filters.date && filters.date !== 'all') {
        routesData = await routeService.getRoutesByDate(filters.date);
      } else {
        routesData = await routeService.getAllRoutes();
      }
      
      // Handle ApiResponse structure: { success: boolean, message: string, data: T }
      let routesList = [];
      if (routesData) {
        if (routesData.success && routesData.data) {
          // ApiResponse structure
          routesList = routesData.data;
        } else if (Array.isArray(routesData)) {
          // Direct array response (fallback)
          routesList = routesData;
        } else if (routesData.data) {
          // Another possible structure
          routesList = routesData.data;
        }
      }
      
      if (!Array.isArray(routesList)) {
        throw new Error('Invalid response format: routes data is not an array');
      }
      
      // Enrich routes with ward information
      const enrichedRoutes = await enrichRouteData(routesList);
      
      setRoutes(enrichedRoutes);
    } catch (error) {
      setError(error.message || 'Failed to load routes');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch routes on component mount and when filters change
  useEffect(() => {
    fetchRoutes();
  }, [filters.date, filters.zone, filters.status]);

  // Handle assignment modal
  const handleAssignClick = (route) => {
    setSelectedRoute(route);
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = (assignmentData) => {
    // Update the route in the local state
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.routeId === assignmentData.routeId
          ? {
              ...route,
              collectorId: assignmentData.collectorId,
              collectorName: assignmentData.collectorName,
              truckId: assignmentData.truckId,
              truckName: assignmentData.truckName,
              status: assignmentData.status || 'in_progress' // Update status to in_progress
            }
          : route
      )
    );
    
    // Call the parent callback if provided
    if (onAssignRoute) {
      onAssignRoute(assignmentData);
    }
  };

  // Filter routes based on additional filters
  const filteredRoutes = routes.filter(route => {
    if (filters.zone && filters.zone !== 'all') {
      const zoneMatch = route.zoneName && 
        route.zoneName === filters.zone;
      if (!zoneMatch) return false;
    }
    
    if (filters.status && filters.status !== 'all') {
      const assignmentStatus = getAssignmentStatus(route);
      if (assignmentStatus !== filters.status) return false;
    }
    
    return true;
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Published Routes</h2>
        <div className="flex items-center gap-4">
          {loading && (
            <HiOutlineRefresh className="animate-spin text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            Showing {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            Error loading routes: {error}
          </p>
          <div className="mt-2">
            <button
              onClick={fetchRoutes}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
              <HiOutlineRefresh className="mx-auto text-4xl text-gray-400 mb-2 animate-spin" />
              <p className="text-gray-500">Loading routes...</p>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
              <HiOutlineClock className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">No routes available</p>
            </div>
          ) : (
            filteredRoutes.map(route => (
              <RouteCard
                key={route.routeId}
                route={route}
                onAssign={handleAssignClick}
              />
            ))
          )}
        </div>
      )}
      
      {/* Assignment Modal */}
      <AssignCollectorTruckModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        route={selectedRoute}
        onAssign={handleAssignSubmit}
      />
    </div>
  );
};

export default PublishedRoutesCard;
