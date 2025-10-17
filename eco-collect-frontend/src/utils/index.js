/**
 * Utils Index
 * 
 * This module provides a centralized export point for all utility functions
 * used throughout the application.
 */

// Ward utilities
export { 
  getAvailableWardsForDate,
  getAssignedWardNumbers,
  isWardAvailable,
  getWardStatistics,
  sortWardsByNumber,
  filterWardsBySearch,
  default as wardUtils
} from './wardUtils.js';

// Re-export all utilities as a single object for convenience
export * from './wardUtils.js';
