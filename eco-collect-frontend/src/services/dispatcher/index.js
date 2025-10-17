/**
 * Dispatcher Services Index
 * 
 * This module provides a clean interface for all dispatcher-related services
 * following SOLID principles, particularly the Dependency Inversion Principle.
 * 
 * Services exported:
 * - zoneService: Core zone operations
 * - truckService: Core truck operations  
 * - wardService: Core ward operations
 * - routeService: Core route operations
 * - routeWardService: Core route-ward operations
 * - zoneWardService: Orchestrated zone-ward operations
 */

// Core services
import { zoneService } from './zoneService.js';
import { truckService } from './truckService.js';
import { wardService } from './wardService.js';
import { routeService } from './routeService.js';
import { routeWardService } from './routeWardService.js';

// Orchestration services
import { zoneWardService } from './zoneWardService.js';

// Re-export services
export { zoneService, truckService, wardService, routeService, routeWardService, zoneWardService };

/**
 * Service factory for dependency injection
 * This allows for easy testing and mocking of dependencies
 */
export class DispatcherServiceFactory {
  constructor(dependencies = {}) {
    this.zoneService = dependencies.zoneService || zoneService;
    this.truckService = dependencies.truckService || truckService;
    this.wardService = dependencies.wardService || wardService;
    this.routeService = dependencies.routeService || routeService;
    this.routeWardService = dependencies.routeWardService || routeWardService;
    this.zoneWardService = dependencies.zoneWardService || zoneWardService;
  }

  /**
   * Get all services as an object
   * @returns {Object} Object containing all services
   */
  getAllServices() {
    return {
      zoneService: this.zoneService,
      truckService: this.truckService,
      wardService: this.wardService,
      routeService: this.routeService,
      routeWardService: this.routeWardService,
      zoneWardService: this.zoneWardService
    };
  }

  /**
   * Check backend connectivity for all services
   * @returns {Promise<Object>} Connectivity status for each service
   */
  async checkConnectivity() {
    const results = {};
    
    try {
      results.zoneService = await this.zoneService.checkZoneExists?.('test') || { connected: false };
    } catch {
      results.zoneService = { connected: false };
    }

    try {
      results.truckService = await this.truckService.checkBackendConnection?.() || { connected: false };
    } catch {
      results.truckService = { connected: false };
    }

    try {
      results.wardService = await this.wardService.checkBackendConnection?.() || { connected: false };
    } catch {
      results.wardService = { connected: false };
    }

    try {
      results.routeService = await this.routeService.checkBackendConnection?.() || { connected: false };
    } catch {
      results.routeService = { connected: false };
    }

    try {
      results.routeWardService = await this.routeWardService.checkBackendConnection?.() || { connected: false };
    } catch {
      results.routeWardService = { connected: false };
    }

    results.zoneWardService = { connected: true }; // This service orchestrates others

    return results;
  }
}

// Export default factory instance
export const dispatcherServices = new DispatcherServiceFactory();
