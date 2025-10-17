const API_BASE_URL = 'http://localhost:8080/api/followup-pickups';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Followup service error:', error);
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

const followupService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get all followup pickups with optional filters
   * @param {Object} filters - Optional filters (status, wardId, driverId)
   * @returns {Promise<Object>} API response with followup pickups
   */
  getAllFollowups: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.wardId) queryParams.append('wardId', filters.wardId);
      if (filters.driverId) queryParams.append('driverId', filters.driverId);
      
      const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
      const response = await fetch(url, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get a specific followup pickup by ID
   * @param {number} followupId - The followup pickup ID
   * @returns {Promise<Object>} API response with followup pickup details
   */
  getFollowupById: async (followupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${followupId}`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get all pending followup pickups
   * @returns {Promise<Object>} API response with pending followup pickups
   */
  getPendingFollowups: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get all overdue followup pickups
   * @returns {Promise<Object>} API response with overdue followup pickups
   */
  getOverdueFollowups: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/overdue`, fetchConfig('GET'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Create a followup pickup manually
   * @param {Object} followupData - The followup pickup data
   * @returns {Promise<Object>} API response with created followup pickup
   */
  createFollowupPickup: async (followupData) => {
    try {
      const response = await fetch(API_BASE_URL, fetchConfig('POST', followupData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Assign driver and truck to a followup pickup
   * @param {number} followupId - The followup pickup ID
   * @param {number} driverId - The driver ID to assign (optional)
   * @param {number} truckId - The truck ID to assign (optional)
   * @returns {Promise<Object>} API response with updated followup pickup
   */
  assignDriverAndTruck: async (followupId, driverId = null, truckId = null) => {
    try {
      const assignmentData = {};
      if (driverId) assignmentData.newAssignedDriverId = driverId;
      if (truckId) assignmentData.assignedTruckId = truckId;
      
      const response = await fetch(`${API_BASE_URL}/${followupId}/assign`, fetchConfig('PUT', assignmentData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Complete assignment of a followup pickup including driver, truck, collection date,
   * and updates to the route_stops table. Sets status to IN_PROGRESS.
   * @param {number} followupId - The followup pickup ID
   * @param {number} driverId - The driver ID to assign
   * @param {number} truckId - The truck ID to assign
   * @param {string} collectionDate - The new collection date (ISO string)
   * @returns {Promise<Object>} API response with updated followup pickup
   */
  completeFollowupAssignment: async (followupId, driverId, truckId, collectionDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${followupId}/complete-assignment`, fetchConfig('POST', {
        newAssignedDriverId: driverId,
        assignedTruckId: truckId,
        collectionDate: collectionDate
      }));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Update the status of a followup pickup
   * @param {number} followupId - The followup pickup ID
   * @param {string} status - The new status (PENDING, ASSIGNED, IN_PROGRESS, DONE, CANCELLED)
   * @returns {Promise<Object>} API response with updated followup pickup
   */
  updateFollowupStatus: async (followupId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${followupId}/status`, fetchConfig('PUT', status));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Mark a followup pickup as completed
   * @param {number} followupId - The followup pickup ID
   * @param {string} notes - Completion notes (optional)
   * @param {string} photoUrl - Photo URL for completion evidence (optional)
   * @returns {Promise<Object>} API response with updated followup pickup
   */
  markFollowupCompleted: async (followupId, notes = null, photoUrl = null) => {
    try {
      const completionData = {};
      if (notes) completionData.completionNotes = notes;
      if (photoUrl) completionData.photoUrl = photoUrl;
      
      const response = await fetch(`${API_BASE_URL}/${followupId}/complete`, fetchConfig('PUT', completionData));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Cancel a followup pickup
   * @param {number} followupId - The followup pickup ID
   * @param {string} reason - Cancellation reason (optional)
   * @returns {Promise<Object>} API response with updated followup pickup
   */
  cancelFollowup: async (followupId, reason = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${followupId}`, fetchConfig('DELETE', reason));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get followup pickups by status
   * @param {string} status - The status to filter by
   * @returns {Promise<Object>} API response with filtered followup pickups
   */
  getFollowupsByStatus: async (status) => {
    try {
      return followupService.getAllFollowups({ status });
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get followup pickups by ward ID
   * @param {number} wardId - The ward ID to filter by
   * @returns {Promise<Object>} API response with filtered followup pickups
   */
  getFollowupsByWard: async (wardId) => {
    try {
      return followupService.getAllFollowups({ wardId });
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get followup pickups by driver ID (original or assigned)
   * @param {number} driverId - The driver ID to filter by
   * @returns {Promise<Object>} API response with filtered followup pickups
   */
  getFollowupsByDriver: async (driverId) => {
    try {
      return followupService.getAllFollowups({ driverId });
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get followup pickups with combined filters
   * @param {Object} filters - Combined filters object
   * @returns {Promise<Object>} API response with filtered followup pickups
   */
  getFollowupsWithFilters: async (filters) => {
    try {
      return followupService.getAllFollowups(filters);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Process existing MISSED and SKIPPED route stops to create followups
   * This is a one-time operation to handle existing data
   * @returns {Promise<Object>} API response with success message
   */
  processExistingMissedSkippedStops: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/process-existing`, fetchConfig('POST'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Update priority and reason codes for existing followup entries based on business rules
   * - MISSED reason code should have HIGH priority
   * - MANUAL reason code should have HIGH priority  
   * - SKIPPED reason code should have NORMAL priority
   * - OVERDUE reason code should have HIGH priority
   * @returns {Promise<Object>} API response with count of updated entries
   */
  updateFollowupPriorityAndReasonCodes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-priority-reason-codes`, fetchConfig('POST'));
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  }
};

export { followupService };
