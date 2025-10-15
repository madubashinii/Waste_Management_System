package com.csse.ecocollectbackend.dispatcher.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateZoneRequest {
    
    @NotBlank(message = "Zone name is required")
    private String zoneName;
    
    @NotEmpty(message = "At least one ward is required")
    private List<WardDto> wards;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WardDto {
        @NotNull(message = "Ward number is required")
        @Positive(message = "Ward number must be positive")
        private Integer wardNumber;
        
        @NotBlank(message = "Ward name is required")
        private String wardName;
    }
}