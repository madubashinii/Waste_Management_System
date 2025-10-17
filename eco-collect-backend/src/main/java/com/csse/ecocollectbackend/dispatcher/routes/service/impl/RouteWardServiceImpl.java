package com.csse.ecocollectbackend.dispatcher.routes.service.impl;

import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteWard;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteRepository;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteWardRepository;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteWardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteWardServiceImpl implements RouteWardService {
    
    private final RouteWardRepository routeWardRepository;
    private final RouteRepository routeRepository;
    
    @Override
    public RouteWardResponse createRouteWard(CreateRouteWardRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        RouteWard routeWard = new RouteWard(
            route, 
            request.getWardNumber(), 
            request.getWardName(), 
            request.getWardOrder()
        );
        
        RouteWard savedRouteWard = routeWardRepository.save(routeWard);
        return RouteWardResponse.fromEntity(savedRouteWard);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteWardResponse> getRouteWardsByRouteId(Integer routeId) {
        return routeWardRepository.findByRouteRouteIdOrderByWardOrder(routeId).stream()
                .map(RouteWardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteWardResponse> getRouteWardsByDate(LocalDate date) {
        return routeWardRepository.findByRouteCollectionDateOrderByRouteIdAndWardOrder(date).stream()
                .map(RouteWardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteRouteWardsByRouteId(Integer routeId) {
        routeWardRepository.deleteByRouteRouteId(routeId);
    }
    
    @Override
    public void deleteRouteWard(Integer routeWardId) {
        if (!routeWardRepository.existsById(routeWardId)) {
            throw new RuntimeException("Route ward not found");
        }
        routeWardRepository.deleteById(routeWardId);
    }
}
