package com.csse.ecocollectbackend.dispatcher.routes.entity;

import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "route_stops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteStop {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Integer stopId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;
    
    @Column(name = "bin_id", nullable = false)
    private Integer binId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private User resident;
    
    @Column(name = "stop_order")
    private Integer stopOrder;
    
    @Column(name = "collected")
    private Boolean collected = false;
    
    @Column(name = "photo_url", length = 255)
    private String photoUrl;
    
    @Column(name = "planned_eta")
    private LocalDateTime plannedEta;
    
    @Column(name = "arrived_at")
    private LocalDateTime arrivedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private StopStatus status = StopStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reassigned_to_driver_id")
    private User reassignedToDriver;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "reason_code", length = 20)
    private ReasonCode reasonCode = ReasonCode.NONE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 10)
    private Source source = Source.MANUAL;
    
    @Column(name = "weight_kg", precision = 8, scale = 3)
    private BigDecimal weightKg = BigDecimal.ZERO;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum StopStatus {
        PENDING("PENDING"),
        IN_PROGRESS("IN_PROGRESS"),
        DONE("DONE"),
        MISSED("MISSED"),
        SKIPPED("SKIPPED");
        
        private final String value;
        
        StopStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    public enum ReasonCode {
        NONE("NONE"),
        BLOCKED("BLOCKED"),
        NO_BIN_OUT("NO_BIN_OUT"),
        SAFETY("SAFETY"),
        OTHER("OTHER");
        
        private final String value;
        
        ReasonCode(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    public enum Source {
        QR("QR"),
        MANUAL("MANUAL");
        
        private final String value;
        
        Source(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
