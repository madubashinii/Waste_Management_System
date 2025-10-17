package com.csse.ecocollectbackend.dispatcher.zones.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "zones", 
       uniqueConstraints = @UniqueConstraint(name = "unique_zone_name", columnNames = {"zone_name"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zone_id")
    private Long zoneId;
    
    @Column(name = "zone_name", nullable = false, length = 100, unique = true)
    private String zoneName;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Zone(String zoneName) {
        this.zoneName = zoneName;
        this.createdAt = LocalDateTime.now();
    }
}