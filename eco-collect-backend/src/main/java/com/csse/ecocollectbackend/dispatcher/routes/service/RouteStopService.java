package com.csse.ecocollectbackend.dispatcher.routes.service;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RouteStopService {
    
    RouteStop createRouteStop(RouteStop routeStop);
    
    List<RouteStop> getAllRouteStops();
    
    Optional<RouteStop> getRouteStopById(Integer stopId);
    
    List<RouteStop> getRouteStopsByRouteId(Integer routeId);
    
    List<RouteStop> getRouteStopsByRouteIdOrdered(Integer routeId);
    
    List<RouteStop> getRouteStopsByDriverId(Integer driverId);
    
    List<RouteStop> getRouteStopsByDriverIdAndStatus(Integer driverId, RouteStop.StopStatus status);
    
    List<RouteStop> getRouteStopsByBinId(String binId);
    
    List<RouteStop> getRouteStopsByStatus(RouteStop.StopStatus status);
    
    List<RouteStop> getRouteStopsByCollected(Boolean collected);
    
    List<RouteStop> getRouteStopsByRouteAndStatus(Integer routeId, RouteStop.StopStatus status);
    
    List<RouteStop> getRouteStopsByRouteAndCollected(Integer routeId, Boolean collected);
    
    List<RouteStop> getRouteStopsByPlannedEtaBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    List<RouteStop> getRouteStopsByArrivedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    Optional<RouteStop> getRouteStopByRouteIdAndBinId(Integer routeId, String binId);
    
    Long countRouteStopsByRouteId(Integer routeId);
    
    Long countCollectedRouteStopsByRouteId(Integer routeId);
    
    Long countRouteStopsByRouteAndStatus(Integer routeId, RouteStop.StopStatus status);
    
    RouteStop updateRouteStop(RouteStop routeStop);
    
    RouteStop updateRouteStopStatus(Integer stopId, RouteStop.StopStatus status);
    
    RouteStop updateRouteStopCollected(Integer stopId, Boolean collected);
    
    RouteStop updateRouteStopArrivedAt(Integer stopId, LocalDateTime arrivedAt);
    
    RouteStop updateRouteStopPhoto(Integer stopId, String photoUrl);
    
    /**
     * Update route stop status and create followup if status is MISSED or SKIPPED
     */
    RouteStop updateRouteStopStatusWithFollowup(Integer stopId, RouteStop.StopStatus status);
    
    /**
     * Updates all existing route stops to have planned_eta based on their route's collection_date
     * This method fixes route stops that were created before the planned_eta calculation was corrected
     * 
     * @return The number of route stops that were updated
     */
    int updateAllRouteStopsPlannedEta();
    
    RouteStop updateRouteStopWeight(Integer stopId, java.math.BigDecimal weightKg);
    
    RouteStop updateRouteStopNotes(Integer stopId, String notes);
    
    RouteStop updateRouteStopReasonCode(Integer stopId, RouteStop.ReasonCode reasonCode);
    
    RouteStop reassignRouteStop(Integer stopId, Integer newDriverId);
    
    void updateRouteStopsDriverForRoute(Integer routeId, Integer driverId);
    
    void deleteRouteStop(Integer stopId);
    
    boolean existsById(Integer stopId);
}
