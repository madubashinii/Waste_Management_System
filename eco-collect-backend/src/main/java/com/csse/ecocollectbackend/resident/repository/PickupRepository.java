package com.csse.ecocollectbackend.resident.repository;
import com.csse.ecocollectbackend.resident.entity.Pickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PickupRepository extends JpaRepository<Pickup, Integer> {}


