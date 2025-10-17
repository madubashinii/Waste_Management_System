const API_BASE_URL = 'http://localhost:8080/api/dispatcher/trucks';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Truck service error:', error);
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

const truckService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  getAllTrucks: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getTruckById: async (truckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${truckId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getTruckByName: async (truckName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/name/${truckName}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  createTruck: async (truckData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', truckData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  updateTruck: async (truckId, truckData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${truckId}`, fetchConfig('PUT', truckData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  deleteTruck: async (truckId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${truckId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  checkTruckNameExists: async (truckName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exists/${truckName}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  }
};

export { truckService };
