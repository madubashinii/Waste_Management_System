package com.csse.ecocollectbackend.admin.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "waste_types")
@Data
public class WasteType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wasteTypeId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Boolean recyclable = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // If you're not using Lombok, add these getters and setters manually:

    public Long getWasteTypeId() {
        return wasteTypeId;
    }

    public void setWasteTypeId(Long wasteTypeId) {
        this.wasteTypeId = wasteTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getRecyclable() {
        return recyclable;
    }

    public void setRecyclable(Boolean recyclable) {
        this.recyclable = recyclable;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}