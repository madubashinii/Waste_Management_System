package com.csse.ecocollectbackend.dispatcher.repository;

import com.csse.ecocollectbackend.dispatcher.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    
    /**
     * Find all zones by zone name
     */
    List<Zone> findByZoneName(String zoneName);
    
    /**
     * Find a specific ward by zone name and ward number
     */
    Optional<Zone> findByZoneNameAndWardNumber(String zoneName, Integer wardNumber);
    
    /**
     * Check if a ward exists for a given zone name and ward number
     */
    boolean existsByZoneNameAndWardNumber(String zoneName, Integer wardNumber);
    
    /**
     * Get all distinct zone names
     */
    @Query("SELECT DISTINCT z.zoneName FROM Zone z ORDER BY z.zoneName")
    List<String> findDistinctZoneNames();
    
    /**
     * Get all wards for a specific zone name
     */
    @Query("SELECT z FROM Zone z WHERE z.zoneName = :zoneName ORDER BY z.wardNumber")
    List<Zone> findWardsByZoneName(@Param("zoneName") String zoneName);
    
    /**
     * Count total wards in a zone
     */
    @Query("SELECT COUNT(z) FROM Zone z WHERE z.zoneName = :zoneName")
    long countWardsByZoneName(@Param("zoneName") String zoneName);
}
