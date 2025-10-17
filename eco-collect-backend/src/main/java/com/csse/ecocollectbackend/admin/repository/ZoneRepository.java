package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findAll();
    Optional<Zone> findByZoneName(String zoneName);
    boolean existsByZoneName(String zoneName);

}