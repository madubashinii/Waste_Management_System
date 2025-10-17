package com.csse.ecocollectbackend.dispatcher.routes.dto;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteWard;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RouteWardResponse {
    
    private Integer routeWardId;
    private Integer routeId;
    private Integer wardNumber;
    private String wardName;
    private Integer wardOrder;
    private LocalDateTime createdAt;
    
    public static RouteWardResponse fromEntity(RouteWard routeWard) {
        RouteWardResponse response = new RouteWardResponse();
        response.setRouteWardId(routeWard.getRouteWardId());
        response.setRouteId(routeWard.getRoute().getRouteId());
        response.setWardNumber(routeWard.getWardNumber());
        response.setWardName(routeWard.getWardName());
        response.setWardOrder(routeWard.getWardOrder());
        response.setCreatedAt(routeWard.getCreatedAt());
        return response;
    }
}
