package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.dto.PaymentRequest;
import com.csse.ecocollectbackend.resident.entity.Billing;
import com.csse.ecocollectbackend.resident.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping("/resident/{residentId}")
    public List<Billing> getBilling(@PathVariable Integer residentId,
                                    @RequestParam(required = false, defaultValue = "all") String status) {
        return billingService.getBillingByResident(residentId, status);
    }

    @GetMapping("/{invoiceId}")
    public Billing getBillingById(@PathVariable Integer invoiceId) {
        return billingService.getBillingById(invoiceId);
    }

    @PostMapping("/payment")
    public String submitPayment(@RequestBody PaymentRequest request) {
        billingService.submitPayment(request);
        return "Payment submitted successfully";
    }
}
