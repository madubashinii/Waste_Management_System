package com.csse.ecocollectbackend.dispatcher.repository;

import com.csse.ecocollectbackend.dispatcher.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    
    @Query("SELECT v FROM Vehicle v WHERE v.vehicleNumber = :vehicleNumber")
    Optional<Vehicle> findByVehicleNumber(@Param("vehicleNumber") String vehicleNumber);
    
    @Query("SELECT COUNT(v) > 0 FROM Vehicle v WHERE v.vehicleNumber = :vehicleNumber")
    boolean existsByVehicleNumber(@Param("vehicleNumber") String vehicleNumber);
}