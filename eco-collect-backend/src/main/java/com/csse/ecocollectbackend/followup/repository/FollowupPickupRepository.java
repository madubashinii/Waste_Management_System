package com.csse.ecocollectbackend.followup.repository;

import com.csse.ecocollectbackend.followup.entity.FollowupPickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Optimized repository with only essential queries following SOLID principles
 * Single Responsibility: Data access for followup pickups
 * Interface Segregation: Only exposes necessary methods
 */
@Repository
public interface FollowupPickupRepository extends JpaRepository<FollowupPickup, Integer> {
    
    // Essential queries only - following YAGNI principle
    
    /**
     * Find followup pickups by status
     */
    List<FollowupPickup> findByStatus(FollowupPickup.FollowupStatus status);
    
    /**
     * Find pending followup pickups that are overdue (due date has passed)
     */
    @Query("SELECT fp FROM FollowupPickup fp WHERE fp.status = :status AND fp.dueAt < :currentDateTime")
    List<FollowupPickup> findPendingOverdue(@Param("status") FollowupPickup.FollowupStatus status, 
                                          @Param("currentDateTime") LocalDateTime currentDateTime);
    
    /**
     * Find followup pickup by source route stop ID (for duplicate prevention)
     */
    @Query("SELECT fp FROM FollowupPickup fp WHERE fp.sourceRouteStop.stopId = :routeStopId")
    Optional<FollowupPickup> findBySourceRouteStopStopId(@Param("routeStopId") Integer routeStopId);
    
    /**
     * Find followup pickups by driver (original or assigned)
     */
    @Query("SELECT fp FROM FollowupPickup fp WHERE fp.originalDriver.userId = :driverId OR fp.newAssignedDriver.userId = :driverId")
    List<FollowupPickup> findByDriverId(@Param("driverId") Integer driverId);
    
    /**
     * Find followup pickups by ward ID
     */
    List<FollowupPickup> findByWardWardId(Integer wardId);
}
