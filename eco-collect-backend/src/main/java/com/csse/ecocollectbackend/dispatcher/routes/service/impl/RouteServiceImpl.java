package com.csse.ecocollectbackend.dispatcher.routes.service.impl;

import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteRepository;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteService;
import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import com.csse.ecocollectbackend.dispatcher.zones.repository.ZoneRepository;
import com.csse.ecocollectbackend.dispatcher.trucks.repository.TruckRepository;
import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteServiceImpl implements RouteService {
    
    private final RouteRepository routeRepository;
    private final ZoneRepository zoneRepository;
    private final TruckRepository truckRepository;
    private final UserRepository userRepository;
    
    @Override
    public RouteResponse createRoute(CreateRouteRequest request) {
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zone not found"));
        
        User dispatcher = userRepository.findById(request.getDispatcherId())
                .orElseThrow(() -> new RuntimeException("Dispatcher not found"));
        
        Route route = new Route();
        route.setRouteName(request.getRouteName());
        route.setZone(zone);
        route.setCollectionDate(request.getCollectionDate());
        route.setVehicleId(request.getVehicleId());
        route.setDispatcher(dispatcher);
        
        if (request.getTruckId() != null) {
            Truck truck = truckRepository.findById(request.getTruckId())
                    .orElseThrow(() -> new RuntimeException("Truck not found"));
            route.setTruck(truck);
        }
        
        if (request.getCollectorId() != null) {
            User collector = userRepository.findById(request.getCollectorId())
                    .orElseThrow(() -> new RuntimeException("Collector not found"));
            route.setCollector(collector);
        }
        
        Route savedRoute = routeRepository.save(route);
        return RouteResponse.fromEntity(savedRoute);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<RouteResponse> getRouteById(Integer routeId) {
        return routeRepository.findById(routeId)
                .map(RouteResponse::fromEntity);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByDispatcher(Integer dispatcherId) {
        return routeRepository.findByDispatcherUserId(dispatcherId).stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByCollector(Integer collectorId) {
        return routeRepository.findByCollectorUserId(collectorId).stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByZone(Long zoneId) {
        return routeRepository.findByZoneZoneId(zoneId).stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByDate(LocalDate date) {
        return routeRepository.findByCollectionDate(date).stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByStatus(Route.RouteStatus status) {
        return routeRepository.findByStatus(status).stream()
                .map(RouteResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public RouteResponse updateRouteStatus(Integer routeId, Route.RouteStatus status) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setStatus(status);
        Route updatedRoute = routeRepository.save(route);
        return RouteResponse.fromEntity(updatedRoute);
    }
    
    @Override
    public RouteResponse assignCollector(Integer routeId, Integer collectorId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        User collector = userRepository.findById(collectorId)
                .orElseThrow(() -> new RuntimeException("Collector not found"));
        
        route.setCollector(collector);
        Route updatedRoute = routeRepository.save(route);
        return RouteResponse.fromEntity(updatedRoute);
    }
    
    @Override
    public RouteResponse assignTruck(Integer routeId, Integer truckId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        
        route.setTruck(truck);
        Route updatedRoute = routeRepository.save(route);
        return RouteResponse.fromEntity(updatedRoute);
    }
    
    @Override
    public void deleteRoute(Integer routeId) {
        if (!routeRepository.existsById(routeId)) {
            throw new RuntimeException("Route not found");
        }
        routeRepository.deleteById(routeId);
    }
}
