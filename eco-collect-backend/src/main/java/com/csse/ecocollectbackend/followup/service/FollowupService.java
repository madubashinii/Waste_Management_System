package com.csse.ecocollectbackend.followup.service;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.followup.dto.FollowupDto;
import com.csse.ecocollectbackend.followup.entity.FollowupPickup;
import com.csse.ecocollectbackend.followup.repository.FollowupPickupRepository;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteStopRepository;
import com.csse.ecocollectbackend.dispatcher.trucks.repository.TruckRepository;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Unified service for all followup operations following SOLID principles
 * Single Responsibility: Manages all followup business logic
 * Open/Closed: Extensible through strategy pattern for different followup types
 * Dependency Inversion: Depends on abstractions (repositories)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FollowupService {
    
    private final FollowupPickupRepository followupRepository;
    private final RouteStopRepository routeStopRepository;
    private final TruckRepository truckRepository;
    private final UserRepository userRepository;
    
    /**
     * Core business operations
     */
    
    public FollowupDto createFromRouteStop(RouteStop routeStop, FollowupPickup.ReasonCode reasonCode) {
        log.info("Creating followup from route stop: {}", routeStop.getStopId());
        
        FollowupPickup followup = FollowupPickup.createFromRouteStop(routeStop, reasonCode);
        // Set ward from route - this would need proper ward lookup logic
        // For now, we'll leave it null and handle in the DTO conversion
        FollowupPickup saved = followupRepository.save(followup);
        return convertToDto(saved);
    }
    
    public List<FollowupDto> getAll() {
        return followupRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FollowupDto> getByStatus(FollowupPickup.FollowupStatus status) {
        return followupRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<FollowupDto> getPending() {
        return getByStatus(FollowupPickup.FollowupStatus.PENDING);
    }
    
    public List<FollowupDto> getOverdue() {
        return followupRepository.findPendingOverdue(
                FollowupPickup.FollowupStatus.PENDING, LocalDateTime.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public FollowupDto getById(Integer id) {
        return followupRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Followup not found with ID: " + id));
    }
    
    /**
     * Assignment operations
     */
    
    public FollowupDto assignDriverAndTruck(Integer followupId, Integer driverId, Integer truckId) {
        log.info("Assigning driver {} and truck {} to followup {}", driverId, truckId, followupId);
        
        FollowupPickup followup = findById(followupId);
        var driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        var truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        
        followup.assign(driver, truck);
        return convertToDto(followupRepository.save(followup));
    }
    
    public FollowupDto completeAssignment(Integer followupId, Integer driverId, Integer truckId, 
                                        LocalDateTime collectionDate) {
        log.info("Completing assignment for followup {}", followupId);
        
        FollowupPickup followup = findById(followupId);
        var driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        var truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        
        followup.assign(driver, truck);
        followup.startProgress();
        
        // Update the original route stop
        updateRouteStopForFollowup(followup.getSourceRouteStop(), driverId, truckId, collectionDate);
        
        return convertToDto(followupRepository.save(followup));
    }
    
    /**
     * Status operations
     */
    
    public FollowupDto updateStatus(Integer followupId, FollowupPickup.FollowupStatus status) {
        FollowupPickup followup = findById(followupId);
        followup.setStatus(status);
        return convertToDto(followupRepository.save(followup));
    }
    
    public FollowupDto markCompleted(Integer followupId, String notes) {
        FollowupPickup followup = findById(followupId);
        followup.complete(notes);
        return convertToDto(followupRepository.save(followup));
    }
    
    public FollowupDto cancel(Integer followupId, String reason) {
        FollowupPickup followup = findById(followupId);
        followup.cancel(reason);
        return convertToDto(followupRepository.save(followup));
    }
    
    /**
     * Detection operations
     */
    
    public void detectMissedSkippedRouteStops() {
        log.info("Detecting missed and skipped route stops for followup creation");
        
        List<RouteStop> missedStops = routeStopRepository.findByStatus(RouteStop.StopStatus.MISSED);
        List<RouteStop> skippedStops = routeStopRepository.findByStatus(RouteStop.StopStatus.SKIPPED);
        
        missedStops.stream()
                .filter(stop -> !followupExistsForRouteStop(stop.getStopId()))
                .forEach(stop -> createFromRouteStop(stop, FollowupPickup.ReasonCode.MISSED));
        
        skippedStops.stream()
                .filter(stop -> !followupExistsForRouteStop(stop.getStopId()))
                .forEach(stop -> createFromRouteStop(stop, FollowupPickup.ReasonCode.SKIPPED));
    }
    
    public int updatePriorityAndReasonCodes() {
        log.info("Updating followup priority and reason codes based on business rules");
        
        List<FollowupPickup> followups = followupRepository.findAll();
        int updatedCount = 0;
        
        for (FollowupPickup followup : followups) {
            FollowupPickup.Priority newPriority = determinePriority(followup.getReasonCode());
            if (!followup.getPriority().equals(newPriority)) {
                followup.setPriority(newPriority);
                followupRepository.save(followup);
                updatedCount++;
            }
        }
        
        return updatedCount;
    }
    
    /**
     * Utility methods
     */
    
    private FollowupPickup findById(Integer id) {
        return followupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Followup not found with ID: " + id));
    }
    
    private boolean followupExistsForRouteStop(Integer routeStopId) {
        return followupRepository.findBySourceRouteStopStopId(routeStopId).isPresent();
    }
    
    private FollowupPickup.Priority determinePriority(FollowupPickup.ReasonCode reasonCode) {
        return switch (reasonCode) {
            case MISSED, MANUAL, OVERDUE -> FollowupPickup.Priority.HIGH;
            case SKIPPED -> FollowupPickup.Priority.NORMAL;
        };
    }
    
    private void updateRouteStopForFollowup(RouteStop routeStop, Integer driverId, Integer truckId, 
                                          LocalDateTime collectionDate) {
        routeStop.setReassignedToDriver(userRepository.findById(driverId).orElse(null));
        routeStop.setStatus(RouteStop.StopStatus.PENDING);
        routeStop.setPlannedEta(collectionDate);
        routeStopRepository.save(routeStop);
    }
    
    private FollowupDto convertToDto(FollowupPickup followup) {
        return FollowupDto.builder()
                .id(followup.getId())
                .sourceRouteStopId(followup.getSourceRouteStop().getStopId())
                .sourceAlertId(followup.getSourceAlertId())
                .wardId(followup.getWard() != null ? followup.getWard().getWardId() : null)
                .wardName(followup.getWard() != null ? followup.getWard().getWardName() : null)
                .binId(followup.getBinId())
                .wasteType(followup.getWasteType())
                .originalDriverId(followup.getOriginalDriver().getUserId())
                .originalDriverName(followup.getOriginalDriver().getName())
                .newAssignedDriverId(followup.getNewAssignedDriver() != null ? 
                        followup.getNewAssignedDriver().getUserId() : null)
                .newAssignedDriverName(followup.getNewAssignedDriver() != null ? 
                        followup.getNewAssignedDriver().getName() : null)
                .assignedTruckId(followup.getAssignedTruck() != null ? 
                        followup.getAssignedTruck().getTruckId() : null)
                .assignedTruckName(followup.getAssignedTruck() != null ? 
                        followup.getAssignedTruck().getTruckName() : null)
                .priority(followup.getPriority())
                .dueAt(followup.getDueAt())
                .status(followup.getStatus())
                .completedAt(followup.getCompletedAt())
                .reasonCode(followup.getReasonCode())
                .notes(followup.getNotes())
                .createdAt(followup.getCreatedAt())
                .updatedAt(followup.getUpdatedAt())
                .isOverdue(followup.isOverdue())
                .daysUntilDue(followup.getDueAt() != null ? 
                        java.time.Duration.between(LocalDateTime.now(), followup.getDueAt()).toDays() : 0)
                .build();
    }
}
