import { zoneService, truckService, wardService, routeService, routeWardService } from '../../services/dispatcher';
import { getAvailableWardsForDate } from '../../utils';

/**
 * Service layer for route data operations
 */
export class RouteDataService {
  static async loadZones() {
    const response = await zoneService.getAllZones();
    if (response && response.success) {
      return response.data || [];
    }
    throw new Error(response?.message || 'Failed to load zones');
  }

  static async loadTrucks() {
    const response = await truckService.getAllTrucks();
    if (response && response.success) {
      return response.data || [];
    }
    throw new Error(response?.message || 'Failed to load trucks');
  }

  static async loadWards() {
    const response = await wardService.getAllWards();
    if (response && response.success) {
      return response.data || [];
    }
    throw new Error(response?.message || 'Failed to load wards');
  }

  static async loadRoutes() {
    const response = await routeService.getAllRoutes();
    if (response && response.success) {
      return response.data || [];
    }
    throw new Error(response?.message || 'Failed to load routes');
  }

  static async loadAssignedWardsForDate(date) {
    const response = await routeWardService.getWardsAssignedOnDate(date);
    if (response && response.success) {
      return response.data || [];
    }
    
    // Don't throw error if endpoint isn't implemented
    if (response?.message && response.message.includes('endpoint not implemented')) {
      return [];
    }
    
    throw new Error(response?.message || 'Failed to load assigned wards');
  }

  static getAvailableWards(zoneId, wards, assignedWards) {
    if (!zoneId || !Array.isArray(wards) || !Array.isArray(assignedWards)) {
      return [];
    }

    try {
      const zoneWards = wards.filter(ward => ward.zoneId === parseInt(zoneId));
      return getAvailableWardsForDate(zoneWards, assignedWards);
    } catch (error) {
      console.warn('Error in getAvailableWards:', error);
      return [];
    }
  }

  static getZoneWards(zoneId, wards) {
    return wards.filter(ward => ward.zoneId === parseInt(zoneId));
  }

  static getActiveTrucks(trucks) {
    return trucks.filter(truck => truck.status === 'Active');
  }

  static getRouteStats(routes) {
    return {
      total: routes.length,
      pending: routes.filter(r => r.status === 'pending').length,
      inProgress: routes.filter(r => r.status === 'in_progress').length,
      completed: routes.filter(r => r.status === 'completed').length
    };
  }
}
