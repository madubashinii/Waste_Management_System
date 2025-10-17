package com.csse.ecocollectbackend.dispatcher.routes.dto;

import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class RouteResponse {
    
    private Integer routeId;
    private String routeName;
    private Long zoneId;
    private String zoneName;
    private LocalDate collectionDate;
    private Integer vehicleId;
    private Integer truckId;
    private String truckName;
    private Integer dispatcherId;
    private String dispatcherName;
    private Integer collectorId;
    private String collectorName;
    private Route.RouteStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static RouteResponse fromEntity(Route route) {
        RouteResponse response = new RouteResponse();
        response.setRouteId(route.getRouteId());
        response.setRouteName(route.getRouteName());
        response.setZoneId(route.getZone().getZoneId());
        response.setZoneName(route.getZone().getZoneName());
        response.setCollectionDate(route.getCollectionDate());
        response.setVehicleId(route.getVehicleId());
        response.setTruckId(route.getTruck() != null ? route.getTruck().getTruckId() : null);
        response.setTruckName(route.getTruck() != null ? route.getTruck().getTruckName() : null);
        response.setDispatcherId(route.getDispatcher().getUserId());
        response.setDispatcherName(route.getDispatcher().getName());
        response.setCollectorId(route.getCollector() != null ? route.getCollector().getUserId() : null);
        response.setCollectorName(route.getCollector() != null ? route.getCollector().getName() : null);
        response.setStatus(route.getStatus());
        response.setCreatedAt(route.getCreatedAt());
        response.setUpdatedAt(route.getUpdatedAt());
        return response;
    }
}
