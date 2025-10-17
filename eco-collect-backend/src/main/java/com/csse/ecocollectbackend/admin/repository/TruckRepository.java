package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TruckRepository extends JpaRepository<Truck, Long> {
    boolean existsByTruckName(String truckName);
}