package com.csse.ecocollectbackend.admin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "waste_types")
public class WasteType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wasteTypeId;

    private String name;
    private Boolean recyclable;

    // Constructors
    public WasteType() {}

    public WasteType(String name, Boolean recyclable) {
        this.name = name;
        this.recyclable = recyclable;
    }

    // Getters and Setters
    public Long getWasteTypeId() { return wasteTypeId; }
    public void setWasteTypeId(Long wasteTypeId) { this.wasteTypeId = wasteTypeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getRecyclable() { return recyclable; }
    public void setRecyclable(Boolean recyclable) { this.recyclable = recyclable; }
}
