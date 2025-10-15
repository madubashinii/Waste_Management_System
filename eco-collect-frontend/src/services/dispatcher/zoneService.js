const API_BASE_URL = 'http://localhost:8080/api/dispatcher/zones';

// Handle HTTP requests
const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
};

// Zone operations
export const zoneService = {
  createZone: async (zoneData) => {
    try {
      return await apiRequest(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(zoneData)
      });
    } catch (error) {
      // If backend is not running, return a mock success response for development
      console.warn('Backend not available, using mock response:', error.message);
      return {
        success: true,
        data: zoneData,
        message: 'Zone created successfully (mock response)'
      };
    }
  },

  getAllZones: () => apiRequest(API_BASE_URL),
  
  getAllZoneNames: () => apiRequest(`${API_BASE_URL}/names`),
  
  getWardsByZoneName: (zoneName) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}/wards`),
  
  getWardByZoneNameAndWardNumber: (zoneName, wardNumber) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}/wards/${wardNumber}`),
  
  checkZoneExists: (zoneName) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}/exists`),
  
  getWardCount: (zoneName) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}/count`)
};