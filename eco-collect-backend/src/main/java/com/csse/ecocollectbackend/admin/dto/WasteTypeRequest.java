package com.csse.ecocollectbackend.admin.dto;

public class WasteTypeRequest {
    private String name;
    private Boolean recyclable;

    // Constructors
    public WasteTypeRequest() {}

    public WasteTypeRequest(String name, Boolean recyclable) {
        this.name = name;
        this.recyclable = recyclable;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getRecyclable() { return recyclable; }
    public void setRecyclable(Boolean recyclable) { this.recyclable = recyclable; }
}