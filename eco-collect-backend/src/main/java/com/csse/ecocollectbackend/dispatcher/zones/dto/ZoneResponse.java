package com.csse.ecocollectbackend.dispatcher.zones.dto;

import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
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
    private LocalDateTime createdAt;
    
    public ZoneResponse(Zone zone) {
        this.zoneId = zone.getZoneId();
        this.zoneName = zone.getZoneName();
        this.createdAt = zone.getCreatedAt();
    }
}