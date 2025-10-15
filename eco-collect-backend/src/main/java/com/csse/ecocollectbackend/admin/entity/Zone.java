package com.csse.ecocollectbackend.admin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "zones")
public class Zone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long zoneId;

    private String zoneName;
    private Integer wardNumber;
    private String wardName;
    private LocalDateTime createdAt;

    // Constructors
    public Zone() {}

    public Zone(String zoneName, Integer wardNumber, String wardName) {
        this.zoneName = zoneName;
        this.wardNumber = wardNumber;
        this.wardName = wardName;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getZoneId() { return zoneId; }
    public void setZoneId(Long zoneId) { this.zoneId = zoneId; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public Integer getWardNumber() { return wardNumber; }
    public void setWardNumber(Integer wardNumber) { this.wardNumber = wardNumber; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
