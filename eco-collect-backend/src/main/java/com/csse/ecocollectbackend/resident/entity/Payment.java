package com.csse.ecocollectbackend.resident.entity;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Billing billing;

    private String transactionId;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String bank;

    public void setBilling(Billing billing) {
    }

    public void setTransactionId(String transactionId) {
    }

    public void setPaymentDate(LocalDate paymentDate) {
    }

    public void setAmount(BigDecimal amount) {
    }

    public void setBank(String bank) {

    }

    // Getters and setters
}

