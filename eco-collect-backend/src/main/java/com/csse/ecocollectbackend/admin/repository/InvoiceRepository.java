package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    List<Invoice> findByResidentNameContainingIgnoreCase(String residentName);
}