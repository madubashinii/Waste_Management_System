package com.csse.ecocollectbackend.followup.entity;

import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import com.csse.ecocollectbackend.dispatcher.wards.entity.Ward;
import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing followup pickup requests for missed, skipped, or overdue waste collections
 * Follows SOLID principles with encapsulated business logic and factory methods
 */
@Entity
@Table(name = "followup_pickups")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowupPickup {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_route_stop_id", nullable = false)
    @NotNull(message = "Source route stop is required")
    private RouteStop sourceRouteStop;
    
    @Column(name = "source_alert_id")
    private Integer sourceAlertId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    @NotNull(message = "Ward is required")
    private Ward ward;
    
    @Column(name = "bin_id", nullable = false)
    @NotBlank(message = "Bin ID is required")
    private String binId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false, columnDefinition = "ENUM('General', 'Recyclable', 'Organic')")
    @NotNull(message = "Waste type is required")
    private WasteType wasteType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_driver_id", nullable = false)
    @NotNull(message = "Original driver is required")
    private User originalDriver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_assigned_driver_id")
    private User newAssignedDriver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_truck_id")
    private Truck assignedTruck;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", columnDefinition = "ENUM('HIGH', 'NORMAL') DEFAULT 'NORMAL'")
    @Builder.Default
    private Priority priority = Priority.NORMAL;
    
    @Column(name = "due_at", nullable = false)
    @NotNull(message = "Due date is required")
    private LocalDateTime dueAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'DONE', 'CANCELLED') DEFAULT 'PENDING'")
    @Builder.Default
    private FollowupStatus status = FollowupStatus.PENDING;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "reason_code", nullable = false, columnDefinition = "ENUM('MISSED', 'SKIPPED', 'OVERDUE', 'MANUAL')")
    @NotNull(message = "Reason code is required")
    private ReasonCode reasonCode;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Factory methods for creating followup pickups
     */
    
    public static FollowupPickup createFromRouteStop(RouteStop routeStop, ReasonCode reasonCode) {
        return FollowupPickup.builder()
                .sourceRouteStop(routeStop)
                .ward(null) // Ward will be set by service layer based on route
                .binId(routeStop.getBinId())
                .wasteType(determineWasteType(routeStop))
                .originalDriver(routeStop.getDriver())
                .dueAt(calculateDueDate(reasonCode))
                .reasonCode(reasonCode)
                .priority(determinePriority(reasonCode))
                .status(FollowupStatus.PENDING)
                .build();
    }
    
    public static FollowupPickup createManual(Integer wardId, String binId, WasteType wasteType, 
                                            Integer driverId, ReasonCode reasonCode) {
        return FollowupPickup.builder()
                .binId(binId)
                .wasteType(wasteType)
                .dueAt(calculateDueDate(reasonCode))
                .reasonCode(reasonCode)
                .priority(determinePriority(reasonCode))
                .status(FollowupStatus.PENDING)
                .build();
    }
    
    /**
     * Business logic methods
     */
    
    public boolean isOverdue() {
        return dueAt != null && dueAt.isBefore(LocalDateTime.now()) && 
               status != FollowupStatus.DONE && status != FollowupStatus.CANCELLED;
    }
    
    public boolean isAssigned() {
        return newAssignedDriver != null && assignedTruck != null;
    }
    
    public boolean canBeCompleted() {
        return status == FollowupStatus.IN_PROGRESS || status == FollowupStatus.ASSIGNED;
    }
    
    public boolean canBeCancelled() {
        return status != FollowupStatus.DONE && status != FollowupStatus.CANCELLED;
    }
    
    public void assign(User driver, Truck truck) {
        if (status != FollowupStatus.PENDING) {
            throw new IllegalStateException("Can only assign pending followups");
        }
        this.newAssignedDriver = driver;
        this.assignedTruck = truck;
        this.status = FollowupStatus.ASSIGNED;
    }
    
    public void startProgress() {
        if (!isAssigned()) {
            throw new IllegalStateException("Followup must be assigned before starting progress");
        }
        this.status = FollowupStatus.IN_PROGRESS;
    }
    
    public void complete(String notes) {
        if (!canBeCompleted()) {
            throw new IllegalStateException("Followup cannot be completed in current status");
        }
        this.status = FollowupStatus.DONE;
        this.completedAt = LocalDateTime.now();
        this.notes = notes;
    }
    
    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Followup cannot be cancelled in current status");
        }
        this.status = FollowupStatus.CANCELLED;
        this.notes = reason;
    }
    
    /**
     * Private helper methods for business logic
     */
    
    private static WasteType determineWasteType(RouteStop routeStop) {
        // Business logic to determine waste type from route stop
        return WasteType.General; // Default implementation
    }
    
    private static LocalDateTime calculateDueDate(ReasonCode reasonCode) {
        return switch (reasonCode) {
            case MISSED -> LocalDateTime.now().plusDays(1); // Next day for missed
            case SKIPPED -> LocalDateTime.now().plusDays(2); // 2 days for skipped
            case OVERDUE -> LocalDateTime.now().plusHours(4); // 4 hours for overdue
            case MANUAL -> LocalDateTime.now().plusDays(1); // Next day for manual
        };
    }
    
    private static Priority determinePriority(ReasonCode reasonCode) {
        return switch (reasonCode) {
            case MISSED, MANUAL, OVERDUE -> Priority.HIGH;
            case SKIPPED -> Priority.NORMAL;
        };
    }
    
    /**
     * Enum representing different types of waste for followup pickups
     */
    public enum WasteType {
        General("General"),
        Recyclable("Recyclable"),
        Organic("Organic");
        
        private final String value;
        
        WasteType(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        @Override
        public String toString() {
            return value;
        }
    }
    
    /**
     * Enum representing the priority level for followup pickups
     */
    public enum Priority {
        HIGH("HIGH"),
        NORMAL("NORMAL");
        
        private final String value;
        
        Priority(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        @Override
        public String toString() {
            return value;
        }
    }
    
    /**
     * Enum representing the status of followup pickups
     */
    public enum FollowupStatus {
        PENDING("PENDING"),
        ASSIGNED("ASSIGNED"),
        IN_PROGRESS("IN_PROGRESS"),
        DONE("DONE"),
        CANCELLED("CANCELLED");
        
        private final String value;
        
        FollowupStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        @Override
        public String toString() {
            return value;
        }
    }
    
    /**
     * Enum representing the reason codes for followup pickups
     */
    public enum ReasonCode {
        MISSED("MISSED"),
        SKIPPED("SKIPPED"),
        OVERDUE("OVERDUE"),
        MANUAL("MANUAL");
        
        private final String value;
        
        ReasonCode(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
        
        @Override
        public String toString() {
            return value;
        }
    }
}
