const API_BASE_URL = 'http://localhost:8080/api/dispatcher/vehicles';

// Common fetch configuration
const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

// Error handler
const handleError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    throw new Error('Network error: Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080');
  }
  throw error;
};

// Response handler
const handleResponse = async (response, operation) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const vehicleService = {
  // Check if backend is reachable
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return handleResponse(response, 'fetching vehicles');
    } catch (error) {
      handleError(error, 'fetching vehicles');
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, fetchConfig('GET'));
      return handleResponse(response, 'fetching vehicle');
    } catch (error) {
      handleError(error, 'fetching vehicle');
    }
  },

  // Get vehicle by number
  getVehicleByNumber: async (vehicleNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/number/${vehicleNumber}`, fetchConfig('GET'));
      return handleResponse(response, 'fetching vehicle by number');
    } catch (error) {
      handleError(error, 'fetching vehicle by number');
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', vehicleData));
      return handleResponse(response, 'creating vehicle');
    } catch (error) {
      handleError(error, 'creating vehicle');
    }
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, fetchConfig('PUT', vehicleData));
      return handleResponse(response, 'updating vehicle');
    } catch (error) {
      handleError(error, 'updating vehicle');
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, fetchConfig('DELETE'));
      return handleResponse(response, 'deleting vehicle');
    } catch (error) {
      handleError(error, 'deleting vehicle');
    }
  },

  // Check if vehicle number exists
  checkVehicleNumberExists: async (vehicleNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exists/${vehicleNumber}`, fetchConfig('GET'));
      return handleResponse(response, 'checking vehicle number');
    } catch (error) {
      handleError(error, 'checking vehicle number');
    }
  }
};

export { vehicleService };