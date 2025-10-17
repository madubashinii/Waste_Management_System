package com.csse.ecocollectbackend.admin.service;

import com.csse.ecocollectbackend.admin.entity.Invoice;
import java.time.LocalDate;
import java.util.List;

public interface BillingService {
    List<Invoice> getAllInvoices();
    List<Invoice> getInvoicesByStatus(String status);
    Invoice getInvoiceById(Long id);
    Invoice createInvoice(Invoice invoice);
    Invoice updateInvoice(Long id, Invoice invoice);
    void deleteInvoice(Long id);
    Invoice approveInvoice(Long id);
    void approveAllInvoices();
    void sendAllInvoices();
    void runBilling(LocalDate startDate, LocalDate endDate);
}