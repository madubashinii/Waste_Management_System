package com.csse.ecocollectbackend.dispatcher.trucks.repository;

import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TruckRepository extends JpaRepository<Truck, Integer> {
    Optional<Truck> findByTruckName(String truckName);
    boolean existsByTruckName(String truckName);
}
