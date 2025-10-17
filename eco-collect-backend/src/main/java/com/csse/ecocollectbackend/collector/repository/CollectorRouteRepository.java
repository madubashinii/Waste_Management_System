/*
// COMMENTED OUT - Collector functionality not in use currently
package com.csse.ecocollectbackend.collector.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CollectorRouteRepository extends JpaRepository<Route, Integer> {
    @Query("SELECT r FROM Route r JOIN FETCH r.zone z WHERE r.collector.userId = :collectorId AND r.collectionDate = :date")
    List<Route> findTodaysRoutesByCollector(@Param("collectorId") Integer collectorId, @Param("date") LocalDate date);
}
*/