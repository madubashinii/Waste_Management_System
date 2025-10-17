package com.csse.ecocollectbackend.resident.dto;

import java.util.List;

public class PickupRequest {
    private Integer userId;
    private Integer zoneId;
    private String ward;
    private String address;
    private String pickupType;
    private List<ItemDTO> items;

    public static class ItemDTO {
        private String type;
        private double quantity;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public double getQuantity() { return quantity; }
        public void setQuantity(double quantity) { this.quantity = quantity; }
    }

    // Getters and setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getZoneId() { return zoneId; }
    public void setZoneId(Integer zoneId) { this.zoneId = zoneId; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPickupType() { return pickupType; }
    public void setPickupType(String pickupType) { this.pickupType = pickupType; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
}
