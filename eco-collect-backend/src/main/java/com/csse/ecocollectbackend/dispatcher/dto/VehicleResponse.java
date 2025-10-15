package com.csse.ecocollectbackend.dispatcher.dto;

import java.time.LocalDateTime;

public class VehicleResponse {
    
    private Integer id;
    private String vehicleNumber;
    private String vehicleType;
    private String capacity;
    private String status;
    private LocalDateTime createdAt;
    
    // Constructors
    public VehicleResponse() {}
    
    public VehicleResponse(Integer id, String vehicleNumber, String vehicleType, String capacity, String status, LocalDateTime createdAt) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    
    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}