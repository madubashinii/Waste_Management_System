package com.csse.ecocollectbackend.resident.repository;

import com.csse.ecocollectbackend.resident.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Integer> {
    // Example: find zone by name or ward
    Zone findByZoneNameAndWardNumber(String zoneName, Integer wardNumber);
}

