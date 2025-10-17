package com.csse.ecocollectbackend.dispatcher.wards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateWardRequest {
    
    @NotNull(message = "Zone ID is required")
    private Long zoneId;
    
    @NotNull(message = "Ward number is required")
    @Positive(message = "Ward number must be positive")
    private Integer wardNumber;
    
    @NotBlank(message = "Ward name is required")
    private String wardName;
}
