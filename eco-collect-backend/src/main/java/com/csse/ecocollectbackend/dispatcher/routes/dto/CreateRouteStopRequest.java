package com.csse.ecocollectbackend.dispatcher.routes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRouteStopRequest {
    
    private Integer routeId;
    private String binId;
    private Integer driverId;
    private Integer residentId;
    private Integer stopOrder;
    private Boolean collected = false;
    private String photoUrl;
    private LocalDateTime plannedEta;
    private LocalDateTime arrivedAt;
    private String status = "PENDING";
    private Integer reassignedToDriverId;
    private String reasonCode = "NONE";
    private String source = "MANUAL";
    private BigDecimal weightKg = BigDecimal.ZERO;
    private String notes;
}
