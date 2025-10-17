package com.csse.ecocollectbackend.resident.dto;

import java.util.List;

public class PickupRequest {
    private String userName;
    private String address;
    private String pickupType;
    private Integer zoneId;
    private List<Item> items;

    public static class Item {
        private String type;
        private Integer quantity;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    // Getters and setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPickupType() { return pickupType; }
    public void setPickupType(String pickupType) { this.pickupType = pickupType; }
    public Integer getZoneId() { return zoneId; }
    public void setZoneId(Integer zoneId) { this.zoneId = zoneId; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
