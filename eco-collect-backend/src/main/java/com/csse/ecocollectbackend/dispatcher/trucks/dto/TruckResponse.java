package com.csse.ecocollectbackend.dispatcher.trucks.dto;

import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckResponse {
    private Integer truckId;
    private String truckName;
    private String truckType;
    private BigDecimal capacityKg;
    private Truck.TruckStatus status;
    private LocalDateTime createdAt;
}
