import { routeService, routeWardService } from '../../services/dispatcher';

/**
 * Service layer for route planner operations
 */
export class RoutePlannerService {
  static async createRoute(routeData) {
    const response = await routeService.createRoute(routeData);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create route');
    }
    
    return response.data;
  }

  static async saveWardOrder(routeId, selectedWards) {
    if (selectedWards.length === 0) {
      return; // No wards to save
    }

    const wardDataArray = selectedWards.map((ward, index) => ({
      wardNumber: ward.wardNumber,
      wardName: ward.wardName,
      wardOrder: index + 1 // 1-based order
    }));
    
    await routeWardService.createMultipleRouteWards(routeId, wardDataArray);
  }

  static validateRouteData(formData) {
    const { routeName, collectionDate, selectedZone, selectedWards, assignedTruck } = formData;
    
    if (!routeName || !routeName.trim()) {
      throw new Error('Route name is required');
    }
    
    if (!collectionDate) {
      throw new Error('Collection date is required');
    }
    
    if (!selectedZone) {
      throw new Error('Zone selection is required');
    }
    
    if (!selectedWards || selectedWards.length === 0) {
      throw new Error('At least one ward must be selected');
    }
    
    if (!assignedTruck) {
      throw new Error('Truck assignment is required');
    }
  }

  static prepareRouteData(formData, dispatcherId) {
    const { routeName, collectionDate, selectedZone, assignedTruck } = formData;
    
    return {
      routeName: routeName.trim(),
      zoneId: parseInt(selectedZone),
      collectionDate: collectionDate,
      truckId: parseInt(assignedTruck),
      dispatcherId: dispatcherId,
      // Note: collectorId is null initially, will be assigned later
      // Note: vehicleId is not used in current implementation
    };
  }
}
