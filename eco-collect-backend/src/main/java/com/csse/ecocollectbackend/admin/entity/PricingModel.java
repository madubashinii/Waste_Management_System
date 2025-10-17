package com.csse.ecocollectbackend.admin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_models")
public class PricingModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modelId;

    private String name;
    private String description;

    @Column(columnDefinition = "JSON")
    private String configuration;

    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public PricingModel() {}

    public PricingModel(String name, String description, Boolean isActive) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}