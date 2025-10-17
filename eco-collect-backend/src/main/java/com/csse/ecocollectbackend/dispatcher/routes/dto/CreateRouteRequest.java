package com.csse.ecocollectbackend.dispatcher.routes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateRouteRequest {
    
    @NotBlank(message = "Route name is required")
    private String routeName;
    
    @NotNull(message = "Zone ID is required")
    private Long zoneId;
    
    @NotNull(message = "Collection date is required")
    private LocalDate collectionDate;
    
    private Integer vehicleId;
    
    private Integer truckId;
    
    @NotNull(message = "Dispatcher ID is required")
    private Integer dispatcherId;
    
    private Integer collectorId;
}
