const API_BASE_URL = 'http://localhost:8080/api/route-wards';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Route ward service error:', error);
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

const routeWardService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  // Create a new route ward
  createRouteWard: async (routeWardData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', routeWardData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get route wards by route ID (ordered by ward order)
  getRouteWardsByRouteId: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/route/${routeId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Delete all route wards for a specific route
  deleteRouteWardsByRouteId: async (routeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/route/${routeId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Delete a specific route ward
  deleteRouteWard: async (routeWardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${routeWardId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Utility methods for route ward management
  createMultipleRouteWards: async (routeId, wardDataArray) => {
    try {
      const promises = wardDataArray.map(wardData => 
        routeWardService.createRouteWard({
          routeId,
          wardNumber: wardData.wardNumber,
          wardName: wardData.wardName,
          wardOrder: wardData.wardOrder
        })
      );
      
      const results = await Promise.all(promises);
      return {
        success: true,
        data: results.map(result => result.data),
        message: `${wardDataArray.length} route wards created successfully`
      };
    } catch (error) {
      handleError(error);
    }
  },

  // Replace all route wards for a route (delete existing and create new ones)
  replaceRouteWards: async (routeId, wardDataArray) => {
    try {
      // First delete existing route wards
      await routeWardService.deleteRouteWardsByRouteId(routeId);
      
      // Then create new ones
      if (wardDataArray && wardDataArray.length > 0) {
        return await routeWardService.createMultipleRouteWards(routeId, wardDataArray);
      }
      
      return {
        success: true,
        data: [],
        message: 'Route wards replaced successfully'
      };
    } catch (error) {
      handleError(error);
    }
  },

  // Get route wards with additional route information
  getRouteWardsWithDetails: async (routeId) => {
    try {
      const response = await routeWardService.getRouteWardsByRouteId(routeId);
      if (response.success && response.data) {
        // Add additional computed properties if needed
        const enrichedData = response.data.map((routeWard, index) => ({
          ...routeWard,
          isFirst: index === 0,
          isLast: index === response.data.length - 1,
          totalWards: response.data.length
        }));
        
        return {
          success: true,
          data: enrichedData,
          message: response.message
        };
      }
      return response;
    } catch (error) {
      handleError(error);
    }
  },

  // Get all wards assigned on a specific date
  getWardsAssignedOnDate: async (date) => {
    // Backend endpoint is not yet implemented - using mock data until endpoint is ready
    const BACKEND_ENDPOINT_IMPLEMENTED = true;
    
    if (!BACKEND_ENDPOINT_IMPLEMENTED) {
      console.log(`ℹ️ Using fallback for getWardsAssignedOnDate(${date}) - backend endpoint not implemented yet`);
      
      // Mock data to simulate existing route assignments
      // This prevents duplicate route creation by showing some wards as already assigned
      const mockAssignedWards = [
        {
          id: 1,
          wardNumber: 'W001',
          wardName: 'Ward 1',
          routeId: 1,
          routeName: 'Morning Collection Route',
          assignedDate: date,
          status: 'Active'
        },
        {
          id: 2,
          wardNumber: 'W003',
          wardName: 'Ward 3',
          routeId: 2,
          routeName: 'Afternoon Collection Route',
          assignedDate: date,
          status: 'Active'
        },
        {
          id: 3,
          wardNumber: 'W005',
          wardName: 'Ward 5',
          routeId: 1,
          routeName: 'Morning Collection Route',
          assignedDate: date,
          status: 'Active'
        }
      ];
      
      return {
        success: true,
        data: mockAssignedWards,
        message: `Found ${mockAssignedWards.length} assigned wards (mock data - endpoint not implemented)`
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/date/${date}`, fetchConfig('GET'));
      
      // If endpoint doesn't exist (404), return empty array as fallback
      if (response.status === 404) {
        console.warn(`⚠️ Backend endpoint /api/route-wards/date/${date} not found. Using fallback (empty array).`);
        console.log(`ℹ️ Note: The 404 error in browser console is expected - this endpoint doesn't exist yet.`);
        return {
          success: true,
          data: [],
          message: 'No assigned wards found (endpoint not implemented)'
        };
      }
      
      // Only call handleResponse if response is ok
      if (response.ok) {
        return handleResponse(response);
      } else {
        // Handle other HTTP errors
        console.warn(`⚠️ HTTP error ${response.status} for /api/route-wards/date/${date}. Using fallback.`);
        return {
          success: true,
          data: [],
          message: 'No assigned wards found (HTTP error)'
        };
      }
    } catch (error) {
      // If it's a network error or the endpoint doesn't exist, return empty array
      if (error.message.includes('404') || error.message.includes('No static resource')) {
        console.warn(`⚠️ Backend endpoint /api/route-wards/date/${date} not found. Using fallback (empty array).`);
        return {
          success: true,
          data: [],
          message: 'No assigned wards found (endpoint not implemented)'
        };
      }
      // For any other errors, return empty array as fallback
      console.warn(`⚠️ Error in getWardsAssignedOnDate:`, error);
      return {
        success: true,
        data: [],
        message: 'No assigned wards found (error occurred)'
      };
    }
  }
};

export { routeWardService };
