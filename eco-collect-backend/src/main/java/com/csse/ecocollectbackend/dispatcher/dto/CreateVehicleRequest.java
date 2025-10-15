package com.csse.ecocollectbackend.dispatcher.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateVehicleRequest {
    
    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20, message = "Vehicle number must not exceed 20 characters")
    private String vehicleNumber;
    
    @NotBlank(message = "Vehicle type is required")
    @Size(max = 50, message = "Vehicle type must not exceed 50 characters")
    private String vehicleType;
    
    @Size(max = 20, message = "Capacity must not exceed 20 characters")
    private String capacity;
    
    @Size(max = 20, message = "Status must not exceed 20 characters")
    private String status = "available";
    
    // Constructors
    public CreateVehicleRequest() {}
    
    public CreateVehicleRequest(String vehicleNumber, String vehicleType, String capacity, String status) {
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.status = status;
    }
    
    // Getters and Setters
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    
    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}