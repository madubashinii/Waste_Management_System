package com.csse.ecocollectbackend.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvoiceRequest {
    private String residentName;
    private BigDecimal amount;
    private String status;
    private LocalDate dueDate;
    private LocalDate billingPeriodStart;
    private LocalDate billingPeriodEnd;

    // Constructors
    public InvoiceRequest() {}

    public InvoiceRequest(String residentName, BigDecimal amount, String status) {
        this.residentName = residentName;
        this.amount = amount;
        this.status = status;
    }

    // Getters and Setters
    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getBillingPeriodStart() { return billingPeriodStart; }
    public void setBillingPeriodStart(LocalDate billingPeriodStart) { this.billingPeriodStart = billingPeriodStart; }

    public LocalDate getBillingPeriodEnd() { return billingPeriodEnd; }
    public void setBillingPeriodEnd(LocalDate billingPeriodEnd) { this.billingPeriodEnd = billingPeriodEnd; }
}