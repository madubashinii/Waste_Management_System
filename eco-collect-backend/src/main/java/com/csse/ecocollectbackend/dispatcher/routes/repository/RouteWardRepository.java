package com.csse.ecocollectbackend.dispatcher.routes.repository;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteWard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RouteWardRepository extends JpaRepository<RouteWard, Integer> {
    
    List<RouteWard> findByRouteRouteIdOrderByWardOrder(Integer routeId);
    
    List<RouteWard> findByRouteRouteId(Integer routeId);
    
    void deleteByRouteRouteId(Integer routeId);
    
    @Query("SELECT rw FROM RouteWard rw WHERE rw.route.collectionDate = :collectionDate ORDER BY rw.route.routeId, rw.wardOrder")
    List<RouteWard> findByRouteCollectionDateOrderByRouteIdAndWardOrder(@Param("collectionDate") LocalDate collectionDate);
}
