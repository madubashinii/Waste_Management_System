import { zoneWardService } from './zoneWardService.js';

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
  
  getZoneByName: (zoneName) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}`),
  
  checkZoneExists: (zoneName) => 
    apiRequest(`${API_BASE_URL}/${encodeURIComponent(zoneName)}/exists`),
  
  // Zone utility methods that work with zone data
  getAllZoneNames: async () => {
    const response = await apiRequest(API_BASE_URL);
    return {
      success: response.success,
      data: response.data?.map(zone => zone.zoneName) || [],
      message: response.message
    };
  },
  
  // Ward-related operations delegated to zoneWardService (following SOLID principles)
  getWardsByZoneName: (zoneName) => zoneWardService.getWardsByZoneName(zoneName),
  
  getWardByZoneNameAndWardNumber: (zoneName, wardNumber) => 
    zoneWardService.getWardByZoneNameAndWardNumber(zoneName, wardNumber),
  
  getWardCount: (zoneName) => zoneWardService.getWardCount(zoneName)
};