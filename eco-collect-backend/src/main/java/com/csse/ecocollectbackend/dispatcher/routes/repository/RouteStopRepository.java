package com.csse.ecocollectbackend.dispatcher.routes.repository;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Integer> {
    
    List<RouteStop> findByRouteRouteId(Integer routeId);
    
    List<RouteStop> findByRouteRouteIdOrderByStopOrder(Integer routeId);
    
    List<RouteStop> findByDriverUserId(Integer driverId);
    
    List<RouteStop> findByDriverUserIdAndStatus(Integer driverId, RouteStop.StopStatus status);
    
    List<RouteStop> findByBinId(String binId);
    
    List<RouteStop> findByStatus(RouteStop.StopStatus status);
    
    List<RouteStop> findByCollected(Boolean collected);
    
    @Query("SELECT rs FROM RouteStop rs WHERE rs.route.routeId = :routeId AND rs.status = :status")
    List<RouteStop> findByRouteAndStatus(@Param("routeId") Integer routeId, @Param("status") RouteStop.StopStatus status);
    
    @Query("SELECT rs FROM RouteStop rs WHERE rs.route.routeId = :routeId AND rs.collected = :collected")
    List<RouteStop> findByRouteAndCollected(@Param("routeId") Integer routeId, @Param("collected") Boolean collected);
    
    @Query("SELECT rs FROM RouteStop rs WHERE rs.plannedEta BETWEEN :startTime AND :endTime")
    List<RouteStop> findByPlannedEtaBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT rs FROM RouteStop rs WHERE rs.arrivedAt BETWEEN :startTime AND :endTime")
    List<RouteStop> findByArrivedAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    Optional<RouteStop> findByRouteRouteIdAndBinId(Integer routeId, String binId);
    
    @Query("SELECT COUNT(rs) FROM RouteStop rs WHERE rs.route.routeId = :routeId")
    Long countByRoute(@Param("routeId") Integer routeId);
    
    @Query("SELECT COUNT(rs) FROM RouteStop rs WHERE rs.route.routeId = :routeId AND rs.collected = true")
    Long countCollectedByRoute(@Param("routeId") Integer routeId);
    
    @Query("SELECT COUNT(rs) FROM RouteStop rs WHERE rs.route.routeId = :routeId AND rs.status = :status")
    Long countByRouteAndStatus(@Param("routeId") Integer routeId, @Param("status") RouteStop.StopStatus status);
    
    @Modifying
    @Query("DELETE FROM RouteStop rs WHERE rs.route.routeId = :routeId")
    void deleteByRouteRouteId(@Param("routeId") Integer routeId);
}
