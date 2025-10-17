package com.csse.ecocollectbackend.dispatcher.routes.service.impl;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteStopRepository;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteStopService;
import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteStopServiceImpl implements RouteStopService {
    
    private final RouteStopRepository routeStopRepository;
    private final UserRepository userRepository;
    
    @Override
    public RouteStop createRouteStop(RouteStop routeStop) {
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getAllRouteStops() {
        return routeStopRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<RouteStop> getRouteStopById(Integer stopId) {
        return routeStopRepository.findById(stopId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByRouteId(Integer routeId) {
        return routeStopRepository.findByRouteRouteId(routeId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByRouteIdOrdered(Integer routeId) {
        return routeStopRepository.findByRouteRouteIdOrderByStopOrder(routeId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByDriverId(Integer driverId) {
        return routeStopRepository.findByDriverUserId(driverId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByDriverIdAndStatus(Integer driverId, RouteStop.StopStatus status) {
        return routeStopRepository.findByDriverUserIdAndStatus(driverId, status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByBinId(Integer binId) {
        return routeStopRepository.findByBinId(binId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByStatus(RouteStop.StopStatus status) {
        return routeStopRepository.findByStatus(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByCollected(Boolean collected) {
        return routeStopRepository.findByCollected(collected);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByRouteAndStatus(Integer routeId, RouteStop.StopStatus status) {
        return routeStopRepository.findByRouteAndStatus(routeId, status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByRouteAndCollected(Integer routeId, Boolean collected) {
        return routeStopRepository.findByRouteAndCollected(routeId, collected);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByPlannedEtaBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return routeStopRepository.findByPlannedEtaBetween(startTime, endTime);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteStop> getRouteStopsByArrivedAtBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return routeStopRepository.findByArrivedAtBetween(startTime, endTime);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<RouteStop> getRouteStopByRouteIdAndBinId(Integer routeId, Integer binId) {
        return routeStopRepository.findByRouteRouteIdAndBinId(routeId, binId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long countRouteStopsByRouteId(Integer routeId) {
        return routeStopRepository.countByRoute(routeId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long countCollectedRouteStopsByRouteId(Integer routeId) {
        return routeStopRepository.countCollectedByRoute(routeId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long countRouteStopsByRouteAndStatus(Integer routeId, RouteStop.StopStatus status) {
        return routeStopRepository.countByRouteAndStatus(routeId, status);
    }
    
    @Override
    public RouteStop updateRouteStop(RouteStop routeStop) {
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopStatus(Integer stopId, RouteStop.StopStatus status) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setStatus(status);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopCollected(Integer stopId, Boolean collected) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setCollected(collected);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopArrivedAt(Integer stopId, LocalDateTime arrivedAt) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setArrivedAt(arrivedAt);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopPhoto(Integer stopId, String photoUrl) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setPhotoUrl(photoUrl);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopWeight(Integer stopId, java.math.BigDecimal weightKg) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setWeightKg(weightKg);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopNotes(Integer stopId, String notes) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setNotes(notes);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop updateRouteStopReasonCode(Integer stopId, RouteStop.ReasonCode reasonCode) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        routeStop.setReasonCode(reasonCode);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    public RouteStop reassignRouteStop(Integer stopId, Integer newDriverId) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        
        User newDriver = userRepository.findById(newDriverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + newDriverId));
        
        routeStop.setReassignedToDriver(newDriver);
        return routeStopRepository.save(routeStop);
    }
    
    @Override
    @Transactional
    public void updateRouteStopsDriverForRoute(Integer routeId, Integer driverId) {
        // Get all route stops for the route
        List<RouteStop> routeStops = routeStopRepository.findByRouteRouteId(routeId);
        
        // Get the driver user
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));
        
        // Update all route stops with the driver
        for (RouteStop routeStop : routeStops) {
            routeStop.setDriver(driver);
            routeStopRepository.save(routeStop);
        }
    }
    
    @Override
    public void deleteRouteStop(Integer stopId) {
        routeStopRepository.deleteById(stopId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer stopId) {
        return routeStopRepository.existsById(stopId);
    }
}
