package com.csse.ecocollectbackend.resident.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_types")
public class WasteType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "waste_type_id")
    private Integer wasteTypeId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Boolean recyclable = false;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Getters and setters
    public Integer getWasteTypeId() { return wasteTypeId; }
    public void setWasteTypeId(Integer wasteTypeId) { this.wasteTypeId = wasteTypeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getRecyclable() { return recyclable; }
    public void setRecyclable(Boolean recyclable) { this.recyclable = recyclable; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
