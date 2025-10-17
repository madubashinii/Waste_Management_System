package com.csse.ecocollectbackend.followup.dto;

import com.csse.ecocollectbackend.followup.entity.FollowupPickup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Unified DTO for all followup operations following SOLID principles
 * Single Responsibility: Handles all followup data transfer
 * Open/Closed: Extensible through builder pattern
 */
@Data
@Builder
public class FollowupDto {
    
    // Core fields
    private Integer id;
    
    @NotNull(message = "Source route stop ID is required")
    private Integer sourceRouteStopId;
    
    private Integer sourceAlertId;
    
    @NotNull(message = "Ward ID is required")
    private Integer wardId;
    
    private String wardName;
    
    @NotBlank(message = "Bin ID is required")
    @Size(max = 50, message = "Bin ID must not exceed 50 characters")
    private String binId;
    
    @NotNull(message = "Waste type is required")
    private FollowupPickup.WasteType wasteType;
    
    @NotNull(message = "Original driver ID is required")
    private Integer originalDriverId;
    
    private String originalDriverName;
    
    private Integer newAssignedDriverId;
    
    private String newAssignedDriverName;
    
    private Integer assignedTruckId;
    
    private String assignedTruckName;
    
    @Builder.Default
    private FollowupPickup.Priority priority = FollowupPickup.Priority.NORMAL;
    
    @NotNull(message = "Due date is required")
    private LocalDateTime dueAt;
    
    @Builder.Default
    private FollowupPickup.FollowupStatus status = FollowupPickup.FollowupStatus.PENDING;
    
    private LocalDateTime completedAt;
    
    @NotNull(message = "Reason code is required")
    private FollowupPickup.ReasonCode reasonCode;
    
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Computed fields
    @Builder.Default
    private boolean isOverdue = false;
    @Builder.Default
    private long daysUntilDue = 0;
    private String routeName;
    private String zoneName;
    
    // Assignment specific fields
    @NotNull(message = "Collection date is required for assignment")
    private LocalDateTime collectionDate;
    
    // Completion specific fields
    @Size(max = 500, message = "Completion notes must not exceed 500 characters")
    private String completionNotes;
    
    private String photoUrl;
    
    /**
     * Factory method for creating request DTO
     */
    public static FollowupDto createRequest(Integer sourceRouteStopId, Integer wardId, String binId,
                                          FollowupPickup.WasteType wasteType, Integer originalDriverId,
                                          LocalDateTime dueAt, FollowupPickup.ReasonCode reasonCode) {
        return FollowupDto.builder()
                .sourceRouteStopId(sourceRouteStopId)
                .wardId(wardId)
                .binId(binId)
                .wasteType(wasteType)
                .originalDriverId(originalDriverId)
                .dueAt(dueAt)
                .reasonCode(reasonCode)
                .build();
    }
    
    /**
     * Factory method for assignment DTO
     */
    public static FollowupDto createAssignment(Integer followupId, Integer driverId, Integer truckId, 
                                             LocalDateTime collectionDate) {
        return FollowupDto.builder()
                .id(followupId)
                .newAssignedDriverId(driverId)
                .assignedTruckId(truckId)
                .collectionDate(collectionDate)
                .build();
    }
    
    /**
     * Factory method for completion DTO
     */
    public static FollowupDto createCompletion(Integer followupId, String completionNotes, String photoUrl) {
        return FollowupDto.builder()
                .id(followupId)
                .completionNotes(completionNotes)
                .photoUrl(photoUrl)
                .completedAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * Business logic: Check if followup is overdue
     */
    public boolean isOverdue() {
        return dueAt != null && dueAt.isBefore(LocalDateTime.now()) && 
               status != FollowupPickup.FollowupStatus.DONE && 
               status != FollowupPickup.FollowupStatus.CANCELLED;
    }
    
    /**
     * Business logic: Calculate days until due
     */
    public long getDaysUntilDue() {
        if (dueAt == null) return 0;
        return java.time.Duration.between(LocalDateTime.now(), dueAt).toDays();
    }
}
