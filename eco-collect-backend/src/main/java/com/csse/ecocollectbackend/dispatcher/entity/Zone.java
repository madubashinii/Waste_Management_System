package com.csse.ecocollectbackend.dispatcher.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "zones", 
       uniqueConstraints = @UniqueConstraint(name = "unique_ward", columnNames = {"zone_name", "ward_number"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zone_id")
    private Long zoneId;
    
    @Column(name = "zone_name", nullable = false, length = 50)
    private String zoneName;
    
    @Column(name = "ward_number", nullable = false)
    private Integer wardNumber;
    
    @Column(name = "ward_name", nullable = false, length = 100)
    private String wardName;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Zone(String zoneName, Integer wardNumber, String wardName) {
        this.zoneName = zoneName;
        this.wardNumber = wardNumber;
        this.wardName = wardName;
        this.createdAt = LocalDateTime.now();
    }
}