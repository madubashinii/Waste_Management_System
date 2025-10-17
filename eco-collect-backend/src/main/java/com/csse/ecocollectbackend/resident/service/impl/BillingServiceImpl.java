package com.csse.ecocollectbackend.resident.service.impl;

import com.csse.ecocollectbackend.resident.dto.PaymentRequest;
import com.csse.ecocollectbackend.resident.entity.Billing;
import com.csse.ecocollectbackend.resident.entity.Payment;
import com.csse.ecocollectbackend.resident.repository.BillingRepository;
import com.csse.ecocollectbackend.resident.repository.PaymentRepository;
import com.csse.ecocollectbackend.resident.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingServiceImpl implements BillingService {

    @Autowired
    private BillingRepository billingRepo;

    @Autowired
    private PaymentRepository paymentRepo;

    @Override
    public List<Billing> getBillingByResident(Integer residentId, String status) {
        List<Billing> billings = billingRepo.findByResidentId(residentId);
        if (status.equalsIgnoreCase("all")) return billings;

        return billings.stream()
                .filter(b -> b.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    @Override
    public Billing getBillingById(Integer invoiceId) {
        return billingRepo.findById(invoiceId).orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Override
    public void submitPayment(PaymentRequest request) {
        Billing billing = billingRepo.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Payment payment = new Payment();
        payment.setBilling(billing);
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(request.getAmount());
        payment.setBank(request.getBank());
        paymentRepo.save(payment);

        // Update billing status to paid
        billing.setStatus(Billing.BillingStatus.paid);
        billingRepo.save(billing);
    }
}

