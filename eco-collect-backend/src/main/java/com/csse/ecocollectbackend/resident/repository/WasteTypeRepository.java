package com.csse.ecocollectbackend.resident.repository;

import com.csse.ecocollectbackend.resident.entity.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WasteTypeRepository extends JpaRepository<WasteType, Integer> {
    WasteType findByName(String name);
}
