package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.PaymentRequest;
import com.csse.ecocollectbackend.resident.entity.Billing;

import java.util.List;

public interface BillingService {
    List<Billing> getBillingByResident(Integer residentId, String status);
    Billing getBillingById(Integer invoiceId);
    void submitPayment(PaymentRequest request);
}
