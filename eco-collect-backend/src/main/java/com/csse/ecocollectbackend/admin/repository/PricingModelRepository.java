package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.PricingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PricingModelRepository extends JpaRepository<PricingModel, Long> {
    List<PricingModel> findAll();
    Optional<PricingModel> findByName(String name);
    List<PricingModel> findByIsActive(Boolean isActive);
}
