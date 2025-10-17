package com.csse.ecocollectbackend.dispatcher.trucks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trucks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Truck {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "truck_id")
    private Integer truckId;
    
    @Column(name = "truck_name", nullable = false, unique = true, length = 100)
    private String truckName;
    
    @Column(name = "truck_type", nullable = false, length = 50)
    private String truckType;
    
    @Column(name = "capacity_kg", precision = 8, scale = 2)
    private BigDecimal capacityKg;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active'")
    private TruckStatus status = TruckStatus.Active;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum TruckStatus {
        Active, Maintenance, Inactive
    }
}
