package com.csse.ecocollectbackend.resident.dto;

import java.time.LocalDate;

public class RequestDTO {

        private int id;
        private String date;
        private String status; // "Pending", "Paid", "Completed"
        private double totalAmount;
        private String invoiceId;

    public RequestDTO(Integer id, LocalDate date, String status, Double totalAmount, String invoiceId) {
        this.id = id;
        //this.date = date;
        this.status = status;
        this.totalAmount = totalAmount;
        this.invoiceId = invoiceId;
    }

    // Getters
    public Integer getId() { return id; }
    //public LocalDate getDate() { return date; }
    public String getStatus() { return status; }
    public Double getTotalAmount() { return totalAmount; }
    public String getInvoiceId() { return invoiceId; }

}
