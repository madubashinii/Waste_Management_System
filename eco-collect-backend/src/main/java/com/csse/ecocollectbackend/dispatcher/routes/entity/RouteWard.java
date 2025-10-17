package com.csse.ecocollectbackend.dispatcher.routes.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_wards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteWard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_ward_id")
    private Integer routeWardId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;
    
    @Column(name = "ward_number", nullable = false)
    private Integer wardNumber;
    
    @Column(name = "ward_name", nullable = false, length = 100)
    private String wardName;
    
    @Column(name = "ward_order", nullable = false)
    private Integer wardOrder;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public RouteWard(Route route, Integer wardNumber, String wardName, Integer wardOrder) {
        this.route = route;
        this.wardNumber = wardNumber;
        this.wardName = wardName;
        this.wardOrder = wardOrder;
        this.createdAt = LocalDateTime.now();
    }
}
