package com.csse.ecocollectbackend.dispatcher.wards.dto;

import com.csse.ecocollectbackend.dispatcher.wards.entity.Ward;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WardResponse {
    
    private Integer wardId;
    private Long zoneId;
    private String zoneName;
    private Integer wardNumber;
    private String wardName;
    private LocalDateTime createdAt;
    
    public static WardResponse fromEntity(Ward ward) {
        WardResponse response = new WardResponse();
        response.setWardId(ward.getWardId());
        response.setZoneId(ward.getZone().getZoneId());
        response.setZoneName(ward.getZone().getZoneName());
        response.setWardNumber(ward.getWardNumber());
        response.setWardName(ward.getWardName());
        response.setCreatedAt(ward.getCreatedAt());
        return response;
    }
}
