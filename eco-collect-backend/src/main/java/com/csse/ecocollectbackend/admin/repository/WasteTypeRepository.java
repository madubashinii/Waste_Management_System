package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WasteTypeRepository extends JpaRepository<WasteType, Long> {
    List<WasteType> findAll();
    List<WasteType> findByRecyclable(Boolean recyclable);
    boolean existsByName(String name);
}
