package com.csse.ecocollectbackend.dispatcher.zones.repository;

import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    
    /**
     * Find zone by zone name
     */
    Optional<Zone> findByZoneName(String zoneName);
    
    /**
     * Check if a zone exists by zone name
     */
    boolean existsByZoneName(String zoneName);
}
