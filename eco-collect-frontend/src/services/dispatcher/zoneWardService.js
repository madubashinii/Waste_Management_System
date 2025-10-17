import { zoneService } from './zoneService.js';
import { wardService } from './wardService.js';

/**
 * Zone-Ward Service - Orchestrates zone and ward operations following SOLID principles
 * 
 * This service follows:
 * - Single Responsibility: Handles zone-ward relationship operations
 * - Open/Closed: Extensible for new zone-ward operations
 * - Liskov Substitution: Can be substituted with other implementations
 * - Interface Segregation: Provides focused interface for zone-ward operations
 * - Dependency Inversion: Depends on abstractions (zoneService, wardService)
 */

class ZoneWardService {
  /**
   * Get all wards for a zone by zone name
   * @param {string} zoneName - The name of the zone
   * @returns {Promise<Object>} Response with wards data
   */
  async getWardsByZoneName(zoneName) {
    try {
      // Get zone information first
      const zoneResponse = await zoneService.getZoneByName(zoneName);
      if (!zoneResponse.success) {
        return { 
          success: false, 
          message: `Zone '${zoneName}' not found`,
          data: null 
        };
      }

      // Get wards for the zone using zoneId
      const wardResponse = await wardService.getWardsByZone(zoneResponse.data.zoneId);
      return wardResponse;
    } catch (error) {
      return { 
        success: false, 
        message: `Error retrieving wards for zone '${zoneName}': ${error.message}`,
        data: null 
      };
    }
  }

  /**
   * Get a specific ward by zone name and ward number
   * @param {string} zoneName - The name of the zone
   * @param {number} wardNumber - The ward number
   * @returns {Promise<Object>} Response with ward data
   */
  async getWardByZoneNameAndWardNumber(zoneName, wardNumber) {
    try {
      // Get zone information first
      const zoneResponse = await zoneService.getZoneByName(zoneName);
      if (!zoneResponse.success) {
        return { 
          success: false, 
          message: `Zone '${zoneName}' not found`,
          data: null 
        };
      }

      // Get all wards for the zone
      const wardResponse = await wardService.getWardsByZone(zoneResponse.data.zoneId);
      if (!wardResponse.success) {
        return wardResponse;
      }

      // Find the specific ward
      const ward = wardResponse.data.find(w => w.wardNumber === wardNumber);
      if (!ward) {
        return { 
          success: false, 
          message: `Ward number ${wardNumber} not found in zone '${zoneName}'`,
          data: null 
        };
      }

      return { 
        success: true, 
        data: ward, 
        message: `Ward ${wardNumber} retrieved successfully from zone '${zoneName}'` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error retrieving ward ${wardNumber} from zone '${zoneName}': ${error.message}`,
        data: null 
      };
    }
  }

  /**
   * Get the count of wards in a zone
   * @param {string} zoneName - The name of the zone
   * @returns {Promise<Object>} Response with ward count
   */
  async getWardCount(zoneName) {
    try {
      const wardResponse = await this.getWardsByZoneName(zoneName);
      if (!wardResponse.success) {
        return wardResponse;
      }

      return { 
        success: true, 
        data: wardResponse.data.length, 
        message: `Found ${wardResponse.data.length} wards in zone '${zoneName}'` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error counting wards for zone '${zoneName}': ${error.message}`,
        data: 0 
      };
    }
  }

  /**
   * Create a ward in a zone
   * @param {string} zoneName - The name of the zone
   * @param {Object} wardData - Ward data (wardNumber, wardName)
   * @returns {Promise<Object>} Response with created ward data
   */
  async createWardInZone(zoneName, wardData) {
    try {
      // Get zone information first
      const zoneResponse = await zoneService.getZoneByName(zoneName);
      if (!zoneResponse.success) {
        return { 
          success: false, 
          message: `Zone '${zoneName}' not found`,
          data: null 
        };
      }

      // Prepare ward data with zoneId
      const wardCreateData = {
        zoneId: zoneResponse.data.zoneId,
        wardNumber: wardData.wardNumber,
        wardName: wardData.wardName
      };

      // Create the ward
      const wardResponse = await wardService.createWard(wardCreateData);
      return wardResponse;
    } catch (error) {
      return { 
        success: false, 
        message: `Error creating ward in zone '${zoneName}': ${error.message}`,
        data: null 
      };
    }
  }

  /**
   * Get zone summary with ward information
   * @param {string} zoneName - The name of the zone
   * @returns {Promise<Object>} Response with zone and ward summary
   */
  async getZoneSummary(zoneName) {
    try {
      // Get zone information
      const zoneResponse = await zoneService.getZoneByName(zoneName);
      if (!zoneResponse.success) {
        return zoneResponse;
      }

      // Get ward count
      const wardCountResponse = await this.getWardCount(zoneName);
      
      return {
        success: true,
        data: {
          zone: zoneResponse.data,
          wardCount: wardCountResponse.success ? wardCountResponse.data : 0,
          hasWards: wardCountResponse.success && wardCountResponse.data > 0
        },
        message: `Zone summary retrieved for '${zoneName}'`
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error retrieving zone summary for '${zoneName}': ${error.message}`,
        data: null 
      };
    }
  }
}

// Export singleton instance
export const zoneWardService = new ZoneWardService();
