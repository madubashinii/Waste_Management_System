package com.csse.ecocollectbackend.resident.repository;

import com.csse.ecocollectbackend.resident.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {}

