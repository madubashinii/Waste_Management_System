package com.csse.ecocollectbackend.dispatcher.routes.service;

import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;

import java.time.LocalDate;
import java.util.List;

public interface RouteWardService {
    
    RouteWardResponse createRouteWard(CreateRouteWardRequest request);
    
    List<RouteWardResponse> getRouteWardsByRouteId(Integer routeId);
    
    List<RouteWardResponse> getRouteWardsByDate(LocalDate date);
    
    void deleteRouteWardsByRouteId(Integer routeId);
    
    void deleteRouteWard(Integer routeWardId);
}
