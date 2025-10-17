package com.csse.ecocollectbackend.admin.controller;

import com.csse.ecocollectbackend.admin.entity.Invoice;
import com.csse.ecocollectbackend.admin.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000")
public class BillingController {

    @Autowired
    private BillingService billingService;

    // GET all invoices or filter by status
    @GetMapping("/invoices")
    public List<Invoice> getInvoices(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return billingService.getInvoicesByStatus(status);
        }
        return billingService.getAllInvoices();
    }

    // Run billing for a period
    @PostMapping("/run")
    public ResponseEntity<?> runBilling(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        billingService.runBilling(from, to);
        return ResponseEntity.ok().body(Map.of(
                "message", "Billing run successfully from " + from + " to " + to,
                "from", from,
                "to", to
        ));
    }

    // Approve a single invoice
    @PutMapping("/invoices/{id}/approve")
    public Invoice approveInvoice(@PathVariable Long id) {
        return billingService.approveInvoice(id);
    }

    // Approve all draft invoices
    @PutMapping("/invoices/approve-all")
    public ResponseEntity<?> approveAllInvoices() {
        billingService.approveAllInvoices();
        return ResponseEntity.ok().body(Map.of(
                "message", "All invoices approved successfully"
        ));
    }

    // Send all approved invoices
    @PutMapping("/invoices/send-all")
    public ResponseEntity<?> sendAllInvoices() {
        billingService.sendAllInvoices();
        return ResponseEntity.ok().body(Map.of(
                "message", "All invoices sent to residents successfully"
        ));
    }

    // Create new invoice
    @PostMapping("/invoices")
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return billingService.createInvoice(invoice);
    }

    // Delete invoice
    @DeleteMapping("/invoices/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        billingService.deleteInvoice(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "Invoice deleted successfully"
        ));
    }
}