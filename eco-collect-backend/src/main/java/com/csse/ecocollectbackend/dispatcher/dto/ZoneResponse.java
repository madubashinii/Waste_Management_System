package com.csse.ecocollectbackend.dispatcher.dto;

import com.csse.ecocollectbackend.dispatcher.entity.Zone;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoneResponse {
    private Long zoneId;
    private String zoneName;
    private Integer wardNumber;
    private String wardName;
    private LocalDateTime createdAt;
    
    public ZoneResponse(Zone zone) {
        this.zoneId = zone.getZoneId();
        this.zoneName = zone.getZoneName();
        this.wardNumber = zone.getWardNumber();
        this.wardName = zone.getWardName();
        this.createdAt = zone.getCreatedAt();
    }
}