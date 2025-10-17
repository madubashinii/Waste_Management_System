package com.csse.ecocollectbackend.dispatcher.routes.entity;

import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer routeId;
    
    @Column(name = "route_name", nullable = false, length = 100)
    private String routeName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;
    
    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;
    
    @Column(name = "vehicle_id")
    private Integer vehicleId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "truck_id")
    private Truck truck;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispatcher_id", nullable = false)
    private User dispatcher;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private User collector;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private RouteStatus status = RouteStatus.pending;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RouteWard> routeWards;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum RouteStatus {
        pending("pending"),
        in_progress("in progress"),
        completed("completed");
        
        private final String value;
        
        RouteStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
