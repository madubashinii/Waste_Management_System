/*
// COMMENTED OUT - Collector functionality not in use currently
package com.csse.ecocollectbackend.collector.repository;

import com.csse.ecocollectbackend.resident.entity.Bin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectorBinCollectionRepository extends JpaRepository<Bin, String> {
    List<Bin> findByRoute_RouteId(Integer routeId);
}
*/