package com.csse.ecocollectbackend.admin.dto;

public class ZoneRequest {
    private String zoneName;
    private Integer wardNumber;
    private String wardName;

    // Constructors
    public ZoneRequest() {}

    public ZoneRequest(String zoneName, Integer wardNumber, String wardName) {
        this.zoneName = zoneName;
        this.wardNumber = wardNumber;
        this.wardName = wardName;
    }

    // Getters and Setters
    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public Integer getWardNumber() { return wardNumber; }
    public void setWardNumber(Integer wardNumber) { this.wardNumber = wardNumber; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }
}