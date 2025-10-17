package com.csse.ecocollectbackend.dispatcher.routes.service;

import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RouteService {
    
    RouteResponse createRoute(CreateRouteRequest request);
    
    List<RouteResponse> getAllRoutes();
    
    Optional<RouteResponse> getRouteById(Integer routeId);
    
    List<RouteResponse> getRoutesByDispatcher(Integer dispatcherId);
    
    List<RouteResponse> getRoutesByCollector(Integer collectorId);
    
    List<RouteResponse> getRoutesByZone(Long zoneId);
    
    List<RouteResponse> getRoutesByDate(LocalDate date);
    
    List<RouteResponse> getRoutesByStatus(Route.RouteStatus status);
    
    RouteResponse updateRouteStatus(Integer routeId, Route.RouteStatus status);
    
    RouteResponse assignCollector(Integer routeId, Integer collectorId);
    
    RouteResponse assignTruck(Integer routeId, Integer truckId);
    
    void deleteRoute(Integer routeId);
}
