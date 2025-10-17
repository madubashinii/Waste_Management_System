const API_BASE_URL = 'http://localhost:8080/api/routes';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Route service error:', error);
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    throw new Error('Network error: Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080');
  }
  throw error;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const routeService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  // Create a new route
  createRoute: async (routeData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', routeData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get all routes
  getAllRoutes: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route by ID
  getRouteById: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes by dispatcher ID
  getRoutesByDispatcher: async (dispatcherId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dispatcher/${dispatcherId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes by collector ID
  getRoutesByCollector: async (collectorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/collector/${collectorId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes by zone ID
  getRoutesByZone: async (zoneId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${zoneId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes by collection date
  getRoutesByDate: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/date/${date}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes by status
  getRoutesByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${status}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route status
  updateRouteStatus: async (routeId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeId}/status?status=${status}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Assign collector to route
  assignCollector: async (routeId, collectorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeId}/assign-collector?collectorId=${collectorId}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Assign truck to route
  assignTruck: async (routeId, truckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeId}/assign-truck?truckId=${truckId}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },


  // Delete route
  deleteRoute: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Utility methods for route management
  getRoutesForToday: async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return routeService.getRoutesByDate(today);
  },

  getPendingRoutes: async () => {
    return routeService.getRoutesByStatus('pending');
  },

  getInProgressRoutes: async () => {
    return routeService.getRoutesByStatus('in_progress');
  },

  getCompletedRoutes: async () => {
    return routeService.getRoutesByStatus('completed');
  },

  // Get routes for a specific date range
  getRoutesByDateRange: async (startDate, endDate) => {
    try {
      const allRoutes = await routeService.getAllRoutes();
      if (allRoutes.success && allRoutes.data) {
        const filteredRoutes = allRoutes.data.filter(route => {
          const routeDate = new Date(route.collectionDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return routeDate >= start && routeDate <= end;
        });
        return {
          success: true,
          data: filteredRoutes,
          message: 'Routes retrieved successfully'
        };
      }
      return allRoutes;
    } catch (error) {
      handleError(error);
    }
  },

  // Get routes with their assigned wards for a specific date
  getRoutesWithWardsByDate: async (date) => {
    try {
      // First get all routes for the date
      const routesResponse = await routeService.getRoutesByDate(date);
      
      if (!routesResponse.success || !routesResponse.data) {
        return {
          success: true,
          data: [],
          message: 'No routes found (endpoint not implemented)'
        };
      }

      // Import routeWardService to get ward details for each route
      const { routeWardService } = await import('./routeWardService.js');
      
      // Get ward details for each route
      const routesWithWards = await Promise.all(
        routesResponse.data.map(async (route) => {
          // Skip routes without valid routeId
          if (!route.routeId) {
            console.warn(`Skipping route without valid routeId:`, route);
            return {
              ...route,
              wards: [],
              wardCount: 0
            };
          }
          
          try {
            const wardsResponse = await routeWardService.getRouteWardsByRouteId(route.routeId);
            return {
              ...route,
              wards: wardsResponse.success ? wardsResponse.data : [],
              wardCount: wardsResponse.success ? wardsResponse.data.length : 0
            };
          } catch (error) {
            console.warn(`Failed to fetch wards for route ${route.routeId}:`, error);
            return {
              ...route,
              wards: [],
              wardCount: 0
            };
          }
        })
      );

      return {
        success: true,
        data: routesWithWards,
        message: `Routes with wards retrieved successfully for date ${date}`
      };
    } catch (error) {
      console.warn('Error getting routes with wards by date:', error);
      return {
        success: true,
        data: [],
        message: 'No routes found (endpoint not implemented)'
      };
    }
  },

  // Get routes that are using specific wards on a date
  getRoutesUsingWardsOnDate: async (date, wardNumbers = []) => {
    // Backend endpoint is not yet implemented - using mock data until endpoint is ready
    const BACKEND_ENDPOINT_IMPLEMENTED = true;
    
    if (!BACKEND_ENDPOINT_IMPLEMENTED) {
      console.log(`ℹ️ Using fallback for getRoutesUsingWardsOnDate(${date}) - backend endpoint not implemented yet`);
      
      // Mock conflicting routes based on the ward numbers
      const mockConflictingRoutes = [];
      
      if (wardNumbers.includes('W001') || wardNumbers.includes('W005')) {
        mockConflictingRoutes.push({
          id: 1,
          routeName: 'Morning Collection Route',
          status: 'Active',
          assignedDate: date,
          wardCount: 2,
          wards: [
            { wardNumber: 'W001', wardName: 'Ward 1' },
            { wardNumber: 'W005', wardName: 'Ward 5' }
          ]
        });
      }
      
      if (wardNumbers.includes('W003')) {
        mockConflictingRoutes.push({
          id: 2,
          routeName: 'Afternoon Collection Route',
          status: 'Active',
          assignedDate: date,
          wardCount: 1,
          wards: [
            { wardNumber: 'W003', wardName: 'Ward 3' }
          ]
        });
      }
      
      return {
        success: true,
        data: mockConflictingRoutes,
        message: `Found ${mockConflictingRoutes.length} conflicting route(s) (mock data - endpoint not implemented)`
      };
    }

    try {
      const routesResponse = await routeService.getRoutesWithWardsByDate(date);
      
      if (!routesResponse.success || !routesResponse.data) {
        return {
          success: true,
          data: [],
          message: 'No routes found (endpoint not implemented)'
        };
      }

      // Filter routes that contain any of the specified ward numbers
      const conflictingRoutes = routesResponse.data.filter(route => {
        if (!route.wards || route.wards.length === 0) return false;
        
        return route.wards.some(ward => 
          wardNumbers.includes(ward.wardNumber || ward.id)
        );
      });

      return {
        success: true,
        data: conflictingRoutes,
        message: `Found ${conflictingRoutes.length} route(s) using the specified wards`
      };
    } catch (error) {
      console.warn('Error getting routes using wards on date:', error);
      return {
        success: true,
        data: [],
        message: 'No routes found (endpoint not implemented)'
      };
    }
  },

  // Get alternative dates with available wards for a zone
  getAlternativeDatesWithAvailableWards: async (zoneId, excludeDate, daysToCheck = 7) => {
    try {
      const today = new Date();
      const alternativeDates = [];
      
      // Check dates in the future (excluding the specified date)
      for (let i = 1; i <= daysToCheck; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        if (dateString === excludeDate) continue;
        
        try {
          const routesResponse = await routeService.getRoutesByDate(dateString);
          if (routesResponse.success && routesResponse.data) {
            // Get all assigned ward numbers for this date
            const assignedWardNumbers = new Set();
            for (const route of routesResponse.data) {
              if (route.zoneId === parseInt(zoneId)) {
                // This is a simplified check - in a real implementation,
                // you'd need to get the actual ward assignments
                assignedWardNumbers.add(`route-${route.routeId}`);
              }
            }
            
            alternativeDates.push({
              date: dateString,
              dateFormatted: checkDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              }),
              availableWards: Math.max(0, 10 - assignedWardNumbers.size), // Simplified calculation
              isRecommended: assignedWardNumbers.size === 0
            });
          }
        } catch (error) {
          console.warn(`Error checking date ${dateString}:`, error);
        }
      }
      
      // Sort by availability (most available first)
      alternativeDates.sort((a, b) => b.availableWards - a.availableWards);
      
      return {
        success: true,
        data: alternativeDates.slice(0, 5), // Return top 5 alternatives
        message: `Found ${alternativeDates.length} alternative dates with available wards`
      };
    } catch (error) {
      console.warn('Error getting alternative dates:', error);
      // Return mock alternative dates as fallback
      const mockDates = [];
      for (let i = 1; i <= 5; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        if (dateString !== excludeDate) {
          mockDates.push({
            date: dateString,
            dateFormatted: checkDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }),
            availableWards: 8, // Mock value
            isRecommended: i === 1
          });
        }
      }
      
      return {
        success: true,
        data: mockDates,
        message: 'Alternative dates (mock data - endpoint not implemented)'
      };
    }
  }
};

export { routeService };
