const API_BASE_URL = 'http://localhost:8080/api/dispatcher/wards';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Ward service error:', error);
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

const wardService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  getAllWards: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getWardById: async (wardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${wardId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getWardsByZone: async (zoneId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${zoneId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  createWard: async (wardData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', wardData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  updateWard: async (wardId, wardData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${wardId}`, fetchConfig('PUT', wardData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  deleteWard: async (wardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${wardId}`, fetchConfig('DELETE'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  checkWardExists: async (zoneId, wardNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/zone/${zoneId}`, fetchConfig('GET'));
      const result = await handleResponse(response);
      if (result.success && result.data) {
        return result.data.some(ward => ward.wardNumber === wardNumber);
      }
      return false;
    } catch (error) {
      handleError(error);
    }
  }
};

export { wardService };
