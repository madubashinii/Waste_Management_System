package com.csse.ecocollectbackend.dispatcher.routes.service;

import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Route Ward Service Interface
 * 
 * This service handles route ward operations and automatically creates route stops
 * when route wards are created. The automatic route stop creation follows this logic:
 * 
 * 1. When a route ward is created via createRouteWard():
 *    - The route ward is saved to the database
 *    - All active bins in that ward are identified
 *    - Route stops are automatically created for each active bin
 *    - Each route stop is assigned a stop order and planned ETA
 * 
 * 2. When a route ward is deleted:
 *    - All associated route stops for bins in that ward are deleted
 *    - The route ward is then deleted
 * 
 * 3. When all route wards for a route are deleted:
 *    - All route stops for that route are deleted
 *    - All route wards for that route are deleted
 * 
 * The service uses mock bin data based on the mockBinsData.js structure:
 * - Each ward has 5 bins with IDs: (wardNumber-1)*5+1 to wardNumber*5
 * - Only bins with status = 'Active' get route stops created
 * - Some bins are 'Inactive' or 'Missing' and are excluded
 * - Examples:
 *   - Ward 1: bins 1-5 (all Active) → 5 route stops
 *   - Ward 2: bins 6-10 (4 Active, 1 Inactive) → 4 route stops
 *   - Ward 3: bins 11-15 (4 Active, 1 Missing) → 4 route stops
 * 
 * In a real implementation, this would query the bins table:
 * SELECT bin_id FROM bins WHERE ward_id = wardNumber AND status = 'Active'
 */
public interface RouteWardService {
    
    /**
     * Creates a new route ward and automatically creates route stops for all active bins in that ward
     * 
     * @param request The route ward creation request
     * @return The created route ward response
     */
    RouteWardResponse createRouteWard(com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest request);
    
    /**
     * Retrieves all route wards for a specific route, ordered by ward order
     * 
     * @param routeId The route ID
     * @return List of route ward responses
     */
    List<RouteWardResponse> getRouteWardsByRouteId(Integer routeId);
    
    /**
     * Retrieves all route wards for a specific date, ordered by route ID and ward order
     * 
     * @param date The collection date
     * @return List of route ward responses
     */
    List<RouteWardResponse> getRouteWardsByDate(LocalDate date);
    
    /**
     * Deletes all route wards for a specific route and their associated route stops
     * 
     * @param routeId The route ID
     */
    void deleteRouteWardsByRouteId(Integer routeId);
    
    /**
     * Deletes a specific route ward and its associated route stops
     * 
     * @param routeWardId The route ward ID
     */
    void deleteRouteWard(Integer routeWardId);
}