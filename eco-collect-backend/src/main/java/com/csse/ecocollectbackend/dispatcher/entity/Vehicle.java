package com.csse.ecocollectbackend.dispatcher.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @Column(name = "vehicle_number", nullable = false, unique = true, length = 20)
    private String vehicleNumber;
    
    @Column(name = "vehicle_type", nullable = false, length = 50)
    private String vehicleType;
    
    @Column(name = "capacity", length = 20)
    private String capacity;
    
    @Column(name = "status", length = 20)
    private String status = "available";
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Vehicle() {}
    
    public Vehicle(String vehicleNumber, String vehicleType, String capacity, String status) {
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.status = status;
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
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}