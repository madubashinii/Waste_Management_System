package com.csse.ecocollectbackend.dispatcher.routes.service.impl;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteStopRepository;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteStopService;
import com.csse.ecocollectbackend.followup.entity.FollowupPickup;
import com.csse.ecocollectbackend.followup.service.FollowupService;
import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RouteStopServiceImpl implements RouteStopService {
    
    private final RouteStopRepository routeStopRepository;
    private final UserRepository userRepository;
    private final FollowupService followupService;
    
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
    public List<RouteStop> getRouteStopsByBinId(String binId) {
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
    public Optional<RouteStop> getRouteStopByRouteIdAndBinId(Integer routeId, String binId) {
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
    
    @Override
    @Transactional
    public RouteStop updateRouteStopStatusWithFollowup(Integer stopId, RouteStop.StopStatus status) {
        RouteStop routeStop = routeStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Route stop not found with id: " + stopId));
        
        RouteStop.StopStatus previousStatus = routeStop.getStatus();
        routeStop.setStatus(status);
        RouteStop savedRouteStop = routeStopRepository.save(routeStop);
        
        // Create followup if status changed to MISSED or SKIPPED
        if ((status == RouteStop.StopStatus.MISSED || status == RouteStop.StopStatus.SKIPPED) 
            && previousStatus != status) {
            try {
                FollowupPickup.ReasonCode reasonCode = status == RouteStop.StopStatus.MISSED 
                        ? FollowupPickup.ReasonCode.MISSED 
                        : FollowupPickup.ReasonCode.SKIPPED;
                
                log.info("Creating followup for route stop ID: {} - Status changed from {} to {}", 
                         stopId, previousStatus, status);
                followupService.createFromRouteStop(routeStop, reasonCode);
                log.info("Successfully created followup pickup for {} route stop ID: {}", status, stopId);
            } catch (Exception e) {
                log.error("Failed to create followup for {} route stop ID: {} - {}", 
                         status, stopId, e.getMessage());
                // Don't rollback the route stop status update - the followup creation can be retried
            }
        } else {
            log.info("No followup created for route stop ID: {} - Status: {} (previous: {})", 
                     stopId, status, previousStatus);
        }
        
        return savedRouteStop;
    }
    
    /**
     * Updates all existing route stops to have planned_eta based on their route's collection_date
     * This method fixes route stops that were created before the planned_eta calculation was corrected
     */
    @Override
    @Transactional
    public int updateAllRouteStopsPlannedEta() {
        List<RouteStop> allRouteStops = routeStopRepository.findAll();
        int updatedCount = 0;
        
        for (RouteStop routeStop : allRouteStops) {
            try {
                // Calculate the correct planned ETA based on route's collection date
                LocalDateTime correctPlannedEta = calculatePlannedEtaFromRouteStop(routeStop);
                
                // Only update if the planned ETA is different
                if (!correctPlannedEta.equals(routeStop.getPlannedEta())) {
                    routeStop.setPlannedEta(correctPlannedEta);
                    routeStopRepository.save(routeStop);
                    updatedCount++;
                    log.info("Updated route stop ID: {} planned_eta from {} to {}", 
                             routeStop.getStopId(), routeStop.getPlannedEta(), correctPlannedEta);
                }
            } catch (Exception e) {
                log.error("Failed to update planned_eta for route stop ID: {} - {}", 
                         routeStop.getStopId(), e.getMessage());
            }
        }
        
        log.info("Updated {} route stops with correct planned_eta values", updatedCount);
        return updatedCount;
    }
    
    /**
     * Calculates the correct planned ETA for a route stop based on its route's collection date
     * This method replicates the logic from RouteWardServiceImpl.calculatePlannedEta
     */
    private LocalDateTime calculatePlannedEtaFromRouteStop(RouteStop routeStop) {
        // Base time: 8:00 AM on the route's collection date
        LocalDateTime baseTime = routeStop.getRoute().getCollectionDate().atTime(8, 0, 0, 0);
        
        // We need to get the ward order from the route ward
        // For now, we'll use a simplified calculation based on stop order
        // In a real scenario, you might want to join with route_wards table
        
        // Add time based on stop order (5 minutes per stop)
        // This is a simplified approach - ideally we'd get the ward order
        baseTime = baseTime.plusMinutes((routeStop.getStopOrder() - 1) * 5);
        
        return baseTime;
    }
}
