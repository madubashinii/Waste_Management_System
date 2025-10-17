package com.csse.ecocollectbackend.dispatcher.wards.repository;

import com.csse.ecocollectbackend.dispatcher.wards.entity.Ward;
import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {
    
    List<Ward> findByZone(Zone zone);
    
    List<Ward> findByZoneZoneId(Long zoneId);
    
    Optional<Ward> findByZoneAndWardNumber(Zone zone, Integer wardNumber);
    
    boolean existsByZoneAndWardNumber(Zone zone, Integer wardNumber);
    
    boolean existsByZoneZoneIdAndWardNumber(Long zoneId, Integer wardNumber);
}
