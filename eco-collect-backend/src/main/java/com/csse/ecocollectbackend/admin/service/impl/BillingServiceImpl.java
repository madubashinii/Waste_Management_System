package com.csse.ecocollectbackend.admin.service.impl;

import com.csse.ecocollectbackend.admin.entity.Invoice;
import com.csse.ecocollectbackend.admin.repository.InvoiceRepository;
import com.csse.ecocollectbackend.admin.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BillingServiceImpl implements BillingService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public List<Invoice> getInvoicesByStatus(String status) {
        try {
            Invoice.InvoiceStatus invoiceStatus = Invoice.InvoiceStatus.valueOf(status.toLowerCase());
            return invoiceRepository.findByStatus(invoiceStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    @Override
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        invoice.setCreatedAt(java.time.LocalDateTime.now());
        invoice.setUpdatedAt(java.time.LocalDateTime.now());
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateInvoice(Long id, Invoice invoice) {
        Invoice existing = getInvoiceById(id);
        existing.setResidentName(invoice.getResidentName());
        existing.setAmount(invoice.getAmount());
        existing.setStatus(invoice.getStatus());
        existing.setDueDate(invoice.getDueDate());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return invoiceRepository.save(existing);
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    @Override
    public Invoice approveInvoice(Long id) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(Invoice.InvoiceStatus.approved);
        invoice.setUpdatedAt(java.time.LocalDateTime.now());
        return invoiceRepository.save(invoice);
    }

    @Override
    public void approveAllInvoices() {
        List<Invoice> draftInvoices = invoiceRepository.findByStatus(Invoice.InvoiceStatus.draft);
        for (Invoice invoice : draftInvoices) {
            invoice.setStatus(Invoice.InvoiceStatus.approved);
            invoice.setUpdatedAt(java.time.LocalDateTime.now());
        }
        invoiceRepository.saveAll(draftInvoices);
    }

    @Override
    public void sendAllInvoices() {
        List<Invoice> approvedInvoices = invoiceRepository.findByStatus(Invoice.InvoiceStatus.approved);
        for (Invoice invoice : approvedInvoices) {
            invoice.setStatus(Invoice.InvoiceStatus.sent);
            invoice.setUpdatedAt(java.time.LocalDateTime.now());
        }
        invoiceRepository.saveAll(approvedInvoices);
    }

    @Override
    public void runBilling(LocalDate startDate, LocalDate endDate) {
        // Simulate billing run - in real app, this would calculate invoices based on waste data
        System.out.println("Running billing from " + startDate + " to " + endDate);
        // This would typically create new draft invoices based on the period
    }
}