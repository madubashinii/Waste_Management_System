package com.csse.ecocollectbackend.admin.dto;

public class PricingModelRequest {
    private String name;
    private String description;
    private String configuration;
    private Boolean isActive;

    // Constructors
    public PricingModelRequest() {}

    public PricingModelRequest(String name, String description, Boolean isActive) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}