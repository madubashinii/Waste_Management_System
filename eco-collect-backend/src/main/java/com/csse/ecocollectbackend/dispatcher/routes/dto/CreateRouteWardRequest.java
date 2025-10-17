package com.csse.ecocollectbackend.dispatcher.routes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRouteWardRequest {
    
    @NotNull(message = "Route ID is required")
    private Integer routeId;
    
    @NotNull(message = "Ward number is required")
    private Integer wardNumber;
    
    @NotBlank(message = "Ward name is required")
    private String wardName;
    
    @NotNull(message = "Ward order is required")
    private Integer wardOrder;
}
