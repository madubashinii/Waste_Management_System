/**
 * Route Stop Utilities
 * 
 * Utility functions for route stop operations following SOLID principles
 * Provides helper functions for data transformation, validation, and formatting
 */

// Route stop status constants
export const ROUTE_STOP_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  MISSED: 'MISSED',
  SKIPPED: 'SKIPPED'
};

// Reason code constants
export const REASON_CODE = {
  NONE: 'NONE',
  BLOCKED: 'BLOCKED',
  NO_BIN_OUT: 'NO_BIN_OUT',
  SAFETY: 'SAFETY',
  OTHER: 'OTHER'
};

// Source constants
export const SOURCE = {
  QR: 'QR',
  MANUAL: 'MANUAL'
};

// Status colors for UI
export const STATUS_COLORS = {
  [ROUTE_STOP_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ROUTE_STOP_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ROUTE_STOP_STATUS.DONE]: 'bg-green-100 text-green-800',
  [ROUTE_STOP_STATUS.MISSED]: 'bg-red-100 text-red-800',
  [ROUTE_STOP_STATUS.SKIPPED]: 'bg-gray-100 text-gray-800'
};

// Reason code colors for UI
export const REASON_CODE_COLORS = {
  [REASON_CODE.NONE]: 'bg-gray-100 text-gray-800',
  [REASON_CODE.BLOCKED]: 'bg-red-100 text-red-800',
  [REASON_CODE.NO_BIN_OUT]: 'bg-orange-100 text-orange-800',
  [REASON_CODE.SAFETY]: 'bg-yellow-100 text-yellow-800',
  [REASON_CODE.OTHER]: 'bg-purple-100 text-purple-800'
};

/**
 * Format route stop status for display
 * @param {string} status - Route stop status
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  const statusMap = {
    [ROUTE_STOP_STATUS.PENDING]: 'Pending',
    [ROUTE_STOP_STATUS.IN_PROGRESS]: 'In Progress',
    [ROUTE_STOP_STATUS.DONE]: 'Done',
    [ROUTE_STOP_STATUS.MISSED]: 'Missed',
    [ROUTE_STOP_STATUS.SKIPPED]: 'Skipped'
  };
  return statusMap[status] || status;
};

/**
 * Format reason code for display
 * @param {string} reasonCode - Reason code
 * @returns {string} Formatted reason code
 */
export const formatReasonCode = (reasonCode) => {
  const reasonMap = {
    [REASON_CODE.NONE]: 'None',
    [REASON_CODE.BLOCKED]: 'Blocked',
    [REASON_CODE.NO_BIN_OUT]: 'No Bin Out',
    [REASON_CODE.SAFETY]: 'Safety',
    [REASON_CODE.OTHER]: 'Other'
  };
  return reasonMap[reasonCode] || reasonCode;
};

/**
 * Format source for display
 * @param {string} source - Source type
 * @returns {string} Formatted source
 */
export const formatSource = (source) => {
  const sourceMap = {
    [SOURCE.QR]: 'QR Code',
    [SOURCE.MANUAL]: 'Manual Entry'
  };
  return sourceMap[source] || source;
};

/**
 * Format weight for display
 * @param {number|string} weightKg - Weight in kg
 * @returns {string} Formatted weight
 */
export const formatWeight = (weightKg) => {
  if (weightKg === null || weightKg === undefined || weightKg === '') {
    return 'N/A';
  }
  const weight = parseFloat(weightKg);
  return isNaN(weight) ? 'N/A' : `${weight.toFixed(2)} kg`;
};

/**
 * Format date/time for display
 * @param {string|Date} dateTime - Date/time to format
 * @returns {string} Formatted date/time
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A';
  
  try {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date for display (date only)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format time for display (time only)
 * @param {string|Date} time - Time to format
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return 'N/A';
  
  try {
    const timeObj = new Date(time);
    return timeObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'Invalid Time';
  }
};

/**
 * Calculate time difference between two dates
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {string} Formatted time difference
 */
export const calculateTimeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return 'N/A';
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    
    if (diffMs < 0) return 'Invalid';
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    
    if (diffHours > 0) {
      return `${diffHours}h ${remainingMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Validate route stop data
 * @param {Object} routeStopData - Route stop data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateRouteStopData = (routeStopData) => {
  const errors = [];
  
  if (!routeStopData.routeId || routeStopData.routeId <= 0) {
    errors.push('Route ID is required and must be positive');
  }
  
  if (!routeStopData.binId || routeStopData.binId <= 0) {
    errors.push('Bin ID is required and must be positive');
  }
  
  if (routeStopData.stopOrder !== undefined && routeStopData.stopOrder < 0) {
    errors.push('Stop order must be non-negative');
  }
  
  if (routeStopData.weightKg !== undefined && routeStopData.weightKg < 0) {
    errors.push('Weight must be non-negative');
  }
  
  if (routeStopData.status && !Object.values(ROUTE_STOP_STATUS).includes(routeStopData.status)) {
    errors.push('Invalid status value');
  }
  
  if (routeStopData.reasonCode && !Object.values(REASON_CODE).includes(routeStopData.reasonCode)) {
    errors.push('Invalid reason code value');
  }
  
  if (routeStopData.source && !Object.values(SOURCE).includes(routeStopData.source)) {
    errors.push('Invalid source value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sort route stops by stop order
 * @param {Array} routeStops - Array of route stops
 * @returns {Array} Sorted route stops
 */
export const sortRouteStopsByOrder = (routeStops) => {
  if (!Array.isArray(routeStops)) return [];
  
  return [...routeStops].sort((a, b) => {
    const orderA = a.stopOrder || 999;
    const orderB = b.stopOrder || 999;
    return orderA - orderB;
  });
};

/**
 * Group route stops by status
 * @param {Array} routeStops - Array of route stops
 * @returns {Object} Route stops grouped by status
 */
export const groupRouteStopsByStatus = (routeStops) => {
  if (!Array.isArray(routeStops)) return {};
  
  return routeStops.reduce((groups, stop) => {
    const status = stop.status || ROUTE_STOP_STATUS.PENDING;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(stop);
    return groups;
  }, {});
};

/**
 * Calculate route stop statistics
 * @param {Array} routeStops - Array of route stops
 * @returns {Object} Route stop statistics
 */
export const calculateRouteStopStats = (routeStops) => {
  if (!Array.isArray(routeStops)) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      done: 0,
      missed: 0,
      skipped: 0,
      collected: 0,
      completionPercentage: 0
    };
  }
  
  const stats = {
    total: routeStops.length,
    pending: 0,
    inProgress: 0,
    done: 0,
    missed: 0,
    skipped: 0,
    collected: 0
  };
  
  routeStops.forEach(stop => {
    // Count by status
    switch (stop.status) {
      case ROUTE_STOP_STATUS.PENDING:
        stats.pending++;
        break;
      case ROUTE_STOP_STATUS.IN_PROGRESS:
        stats.inProgress++;
        break;
      case ROUTE_STOP_STATUS.DONE:
        stats.done++;
        break;
      case ROUTE_STOP_STATUS.MISSED:
        stats.missed++;
        break;
      case ROUTE_STOP_STATUS.SKIPPED:
        stats.skipped++;
        break;
    }
    
    // Count collected
    if (stop.collected) {
      stats.collected++;
    }
  });
  
  // Calculate completion percentage
  stats.completionPercentage = stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;
  
  return stats;
};

/**
 * Filter route stops by criteria
 * @param {Array} routeStops - Array of route stops
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered route stops
 */
export const filterRouteStops = (routeStops, filters = {}) => {
  if (!Array.isArray(routeStops)) return [];
  
  return routeStops.filter(stop => {
    // Filter by status
    if (filters.status && stop.status !== filters.status) {
      return false;
    }
    
    // Filter by collected status
    if (filters.collected !== undefined && stop.collected !== filters.collected) {
      return false;
    }
    
    // Filter by driver ID
    if (filters.driverId && stop.driverId !== filters.driverId) {
      return false;
    }
    
    // Filter by bin ID
    if (filters.binId && stop.binId !== filters.binId) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const stopDate = stop.plannedEta ? new Date(stop.plannedEta) : null;
      if (!stopDate) return false;
      
      if (filters.dateFrom && stopDate < new Date(filters.dateFrom)) {
        return false;
      }
      
      if (filters.dateTo && stopDate > new Date(filters.dateTo)) {
        return false;
      }
    }
    
    // Filter by search term (searches in notes, reason code, etc.)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        stop.notes,
        stop.reasonCode,
        stop.status,
        stop.source
      ].filter(Boolean).map(field => field.toString().toLowerCase());
      
      if (!searchableFields.some(field => field.includes(searchTerm))) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Create a new route stop object with default values
 * @param {Object} overrides - Values to override defaults
 * @returns {Object} New route stop object
 */
export const createRouteStopObject = (overrides = {}) => {
  return {
    routeId: null,
    binId: null,
    driverId: null,
    residentId: null,
    stopOrder: null,
    collected: false,
    photoUrl: null,
    plannedEta: null,
    arrivedAt: null,
    status: ROUTE_STOP_STATUS.PENDING,
    reassignedToDriverId: null,
    reasonCode: REASON_CODE.NONE,
    source: SOURCE.MANUAL,
    weightKg: 0,
    notes: null,
    ...overrides
  };
};

/**
 * Check if a route stop can be updated
 * @param {Object} routeStop - Route stop object
 * @param {string} action - Action to check (e.g., 'update', 'delete', 'reassign')
 * @returns {Object} Result with canPerform and reason
 */
export const canPerformAction = (routeStop, action) => {
  if (!routeStop) {
    return { canPerform: false, reason: 'Route stop not found' };
  }
  
  switch (action) {
    case 'update':
      return { canPerform: true, reason: 'Route stop can be updated' };
    
    case 'delete':
      if (routeStop.status === ROUTE_STOP_STATUS.DONE) {
        return { canPerform: false, reason: 'Cannot delete completed route stop' };
      }
      return { canPerform: true, reason: 'Route stop can be deleted' };
    
    case 'reassign':
      if (routeStop.status === ROUTE_STOP_STATUS.DONE) {
        return { canPerform: false, reason: 'Cannot reassign completed route stop' };
      }
      return { canPerform: true, reason: 'Route stop can be reassigned' };
    
    case 'collect':
      if (routeStop.collected) {
        return { canPerform: false, reason: 'Route stop already collected' };
      }
      return { canPerform: true, reason: 'Route stop can be marked as collected' };
    
    default:
      return { canPerform: false, reason: 'Unknown action' };
  }
};
