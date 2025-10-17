package com.csse.ecocollectbackend.dispatcher.wards.entity;

import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "wards",
       uniqueConstraints = @UniqueConstraint(name = "unique_ward_per_zone", columnNames = {"zone_id", "ward_number"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ward {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ward_id")
    private Integer wardId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;
    
    @Column(name = "ward_number", nullable = false)
    private Integer wardNumber;
    
    @Column(name = "ward_name", nullable = false, length = 100)
    private String wardName;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Ward(Zone zone, Integer wardNumber, String wardName) {
        this.zone = zone;
        this.wardNumber = wardNumber;
        this.wardName = wardName;
        this.createdAt = LocalDateTime.now();
    }
}
