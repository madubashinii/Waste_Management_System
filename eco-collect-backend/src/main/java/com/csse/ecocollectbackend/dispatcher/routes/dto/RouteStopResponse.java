package com.csse.ecocollectbackend.dispatcher.routes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteStopResponse {
    
    private Integer stopId;
    private Integer routeId;
    private LocalDate collectionDate;
    private String binId;
    private Integer driverId;
    private String driverName;
    private Integer residentId;
    private String residentName;
    private Integer stopOrder;
    private Boolean collected;
    private String photoUrl;
    private LocalDateTime plannedEta;
    private LocalDateTime arrivedAt;
    private String status;
    private Integer reassignedToDriverId;
    private String reassignedToDriverName;
    private String reasonCode;
    private String source;
    private BigDecimal weightKg;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
