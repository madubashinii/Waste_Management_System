package com.csse.ecocollectbackend.dispatcher.trucks.dto;

import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class CreateTruckRequest {
    
    @NotBlank(message = "Truck name is required")
    @Size(max = 100, message = "Truck name must not exceed 100 characters")
    private String truckName;
    
    @NotBlank(message = "Truck type is required")
    @Size(max = 50, message = "Truck type must not exceed 50 characters")
    private String truckType;
    
    private BigDecimal capacityKg;
    
    private Truck.TruckStatus status = Truck.TruckStatus.Active;
}
