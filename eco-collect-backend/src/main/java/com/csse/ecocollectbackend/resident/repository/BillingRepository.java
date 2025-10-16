package com.csse.ecocollectbackend.resident.repository;

import com.csse.ecocollectbackend.resident.entity.Billing;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Integer> {

    // Find all invoices for a specific resident
    List<Billing> findByResident(User resident);

    // Find invoices by status
    List<Billing> findByStatus(Billing.Status status);
}

