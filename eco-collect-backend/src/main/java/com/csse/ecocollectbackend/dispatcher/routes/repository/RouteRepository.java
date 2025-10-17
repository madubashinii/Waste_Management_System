package com.csse.ecocollectbackend.dispatcher.routes.repository;

import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
    
    List<Route> findByDispatcherUserId(Integer dispatcherId);
    
    List<Route> findByCollectorUserId(Integer collectorId);
    
    List<Route> findByZoneZoneId(Long zoneId);
    
    List<Route> findByTruckTruckId(Integer truckId);
    
    List<Route> findByCollectionDate(LocalDate collectionDate);
    
    List<Route> findByStatus(Route.RouteStatus status);
    
    @Query("SELECT r FROM Route r WHERE r.collectionDate BETWEEN :startDate AND :endDate")
    List<Route> findByCollectionDateBetween(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    Optional<Route> findByRouteName(String routeName);
}
