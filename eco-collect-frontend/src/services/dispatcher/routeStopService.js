const API_BASE_URL = 'http://localhost:8080/api/route-stops';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Route stop service error:', error);
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

const routeStopService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  // Create a new route stop
  createRouteStop: async (routeStopData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', routeStopData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get all route stops
  getAllRouteStops: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stop by ID
  getRouteStopById: async (stopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by route ID
  getRouteStopsByRouteId: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/route/${routeId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by driver ID
  getRouteStopsByDriverId: async (driverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/driver/${driverId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by driver ID and status
  getRouteStopsByDriverIdAndStatus: async (driverId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/driver/${driverId}/status/${status}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by bin ID
  getRouteStopsByBinId: async (binId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bin/${binId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by status
  getRouteStopsByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${status}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by route ID and collected status
  getRouteStopsByRouteAndCollected: async (routeId, collected) => {
    try {
      const response = await fetch(`${API_BASE_URL}/route/${routeId}/collected/${collected}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by route ID and status
  getRouteStopsByRouteAndStatus: async (routeId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/route/${routeId}/status/${status}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Count route stops by route ID
  countRouteStopsByRouteId: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/count/route/${routeId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Count collected route stops by route ID
  countCollectedRouteStopsByRouteId: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/count/route/${routeId}/collected`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop
  updateRouteStop: async (stopId, routeStopData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}`, fetchConfig('PUT', routeStopData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop status
  updateRouteStopStatus: async (stopId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/status?status=${status}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop status with automatic followup creation
  updateRouteStopStatusWithFollowup: async (stopId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/status-with-followup?status=${status}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop collected status
  updateRouteStopCollected: async (stopId, collected) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/collected?collected=${collected}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop arrived time
  updateRouteStopArrivedAt: async (stopId, arrivedAt) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/arrived?arrivedAt=${arrivedAt}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop photo
  updateRouteStopPhoto: async (stopId, photoUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/photo?photoUrl=${encodeURIComponent(photoUrl)}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop weight
  updateRouteStopWeight: async (stopId, weightKg) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/weight?weightKg=${weightKg}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop notes
  updateRouteStopNotes: async (stopId, notes) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/notes?notes=${encodeURIComponent(notes)}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Update route stop reason code
  updateRouteStopReasonCode: async (stopId, reasonCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/reason?reasonCode=${reasonCode}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Reassign route stop to another driver
  reassignRouteStop: async (stopId, newDriverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}/reassign?newDriverId=${newDriverId}`, fetchConfig('PUT'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Delete route stop
  deleteRouteStop: async (stopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${stopId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Utility methods for route stop management
  
  // Get pending route stops
  getPendingRouteStops: async () => {
    return routeStopService.getRouteStopsByStatus('PENDING');
  },

  // Get in progress route stops
  getInProgressRouteStops: async () => {
    return routeStopService.getRouteStopsByStatus('IN_PROGRESS');
  },

  // Get completed route stops
  getCompletedRouteStops: async () => {
    return routeStopService.getRouteStopsByStatus('DONE');
  },

  // Get missed route stops
  getMissedRouteStops: async () => {
    return routeStopService.getRouteStopsByStatus('MISSED');
  },

  // Get skipped route stops
  getSkippedRouteStops: async () => {
    return routeStopService.getRouteStopsByStatus('SKIPPED');
  },

  // Get route stops for today by driver
  getTodayRouteStopsByDriver: async (driverId) => {
    try {
      const allRouteStops = await routeStopService.getRouteStopsByDriverId(driverId);
      if (allRouteStops.success && allRouteStops.data) {
        const today = new Date().toISOString().split('T')[0];
        const todayRouteStops = allRouteStops.data.filter(stop => {
          if (stop.plannedEta) {
            const stopDate = new Date(stop.plannedEta).toISOString().split('T')[0];
            return stopDate === today;
          }
          return false;
        });
        return {
          success: true,
          data: todayRouteStops,
          message: 'Today\'s route stops retrieved successfully'
        };
      }
      return allRouteStops;
    } catch (error) {
      handleError(error);
    }
  },

  // Get route stops by date range
  getRouteStopsByDateRange: async (startDate, endDate, driverId = null) => {
    try {
      let allRouteStops;
      if (driverId) {
        allRouteStops = await routeStopService.getRouteStopsByDriverId(driverId);
      } else {
        allRouteStops = await routeStopService.getAllRouteStops();
      }
      
      if (allRouteStops.success && allRouteStops.data) {
        const filteredRouteStops = allRouteStops.data.filter(stop => {
          if (stop.plannedEta) {
            const stopDate = new Date(stop.plannedEta);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return stopDate >= start && stopDate <= end;
          }
          return false;
        });
        return {
          success: true,
          data: filteredRouteStops,
          message: 'Route stops retrieved successfully'
        };
      }
      return allRouteStops;
    } catch (error) {
      handleError(error);
    }
  },

  // Get route completion statistics
  getRouteCompletionStats: async (routeId) => {
    try {
      const [totalResponse, collectedResponse] = await Promise.all([
        routeStopService.countRouteStopsByRouteId(routeId),
        routeStopService.countCollectedRouteStopsByRouteId(routeId)
      ]);

      if (totalResponse.success && collectedResponse.success) {
        const total = totalResponse.data || 0;
        const collected = collectedResponse.data || 0;
        const completionPercentage = total > 0 ? Math.round((collected / total) * 100) : 0;
        
        return {
          success: true,
          data: {
            total,
            collected,
            remaining: total - collected,
            completionPercentage
          },
          message: 'Route completion stats retrieved successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to retrieve route completion stats'
      };
    } catch (error) {
      handleError(error);
    }
  },

  // Batch update route stops status
  batchUpdateRouteStopStatus: async (stopIds, status) => {
    try {
      const updatePromises = stopIds.map(stopId => 
        routeStopService.updateRouteStopStatus(stopId, status)
      );
      
      const results = await Promise.allSettled(updatePromises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        success: true,
        data: {
          successful,
          failed,
          total: stopIds.length
        },
        message: `Batch update completed: ${successful} successful, ${failed} failed`
      };
    } catch (error) {
      handleError(error);
    }
  }
};

export { routeStopService };
