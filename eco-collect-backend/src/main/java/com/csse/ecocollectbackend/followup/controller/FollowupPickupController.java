package com.csse.ecocollectbackend.followup.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.followup.dto.FollowupDto;
import com.csse.ecocollectbackend.followup.entity.FollowupPickup;
import com.csse.ecocollectbackend.followup.service.FollowupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Followup Pickup operations following SOLID principles
 * Single Responsibility: Handles HTTP requests for followup operations
 * Dependency Inversion: Depends on service abstraction
 * 
 * @author EcoCollect Team
 * @version 2.0 - Refactored for SOLID principles
 */
@RestController
@RequestMapping("/api/followup-pickups")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@Slf4j
public class FollowupPickupController {
    
    private final FollowupService followupService;
    
    /**
     * Get all followup pickups with optional filters
     * 
     * @param status Optional status filter (PENDING, ASSIGNED, IN_PROGRESS, DONE, CANCELLED)
     * @param wardId Optional ward ID filter
     * @param driverId Optional driver ID filter
     * @return List of followup pickups matching the criteria
     * 
     * @apiExample Get all followups:
     * GET /api/followup-pickups
     * 
     * @apiExample Get pending followups:
     * GET /api/followup-pickups?status=PENDING
     * 
     * @apiExample Get followups by ward:
     * GET /api/followup-pickups?wardId=1
     * 
     * @apiResponse 200 Success response with list of followup pickups
     * @apiResponse 500 Internal server error
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FollowupDto>>> getAllFollowups(
            @RequestParam(required = false) FollowupPickup.FollowupStatus status,
            @RequestParam(required = false) Integer wardId,
            @RequestParam(required = false) Integer driverId) {
        try {
            List<FollowupDto> followups = status != null ? 
                    followupService.getByStatus(status) : 
                    followupService.getAll();
            
            // Apply additional filters if provided
            if (wardId != null) {
                followups = followups.stream()
                        .filter(f -> wardId.equals(f.getWardId()))
                        .toList();
            }
            
            if (driverId != null) {
                followups = followups.stream()
                        .filter(f -> driverId.equals(f.getOriginalDriverId()) || 
                                   driverId.equals(f.getNewAssignedDriverId()))
                        .toList();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Followup pickups retrieved successfully", followups));
        } catch (Exception e) {
            log.error("Error retrieving followup pickups: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve followup pickups: " + e.getMessage()));
        }
    }
    
    /**
     * Get a specific followup pickup by ID
     * 
     * @param id The followup pickup ID
     * @return The followup pickup details
     * 
     * @apiExample Get specific followup:
     * GET /api/followup-pickups/123
     * 
     * @apiResponse 200 Success response with followup pickup details
     * @apiResponse 404 Followup pickup not found
     * @apiResponse 500 Internal server error
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowupDto>> getFollowupById(@PathVariable Integer id) {
        try {
            FollowupDto followup = followupService.getById(id);
            return ResponseEntity.ok(ApiResponse.success("Followup pickup retrieved successfully", followup));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(e.getMessage()));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error(e.getMessage()));
            }
        } catch (Exception e) {
            log.error("Error retrieving followup pickup with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve followup pickup: " + e.getMessage()));
        }
    }
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<FollowupDto>>> getPendingFollowups() {
        try {
            List<FollowupDto> followups = followupService.getPending();
            return ResponseEntity.ok(ApiResponse.success("Pending followup pickups retrieved successfully", followups));
        } catch (Exception e) {
            log.error("Error retrieving pending followup pickups: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve pending followup pickups: " + e.getMessage()));
        }
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<FollowupDto>>> getOverdueFollowups() {
        try {
            List<FollowupDto> followups = followupService.getOverdue();
            return ResponseEntity.ok(ApiResponse.success("Overdue followup pickups retrieved successfully", followups));
        } catch (Exception e) {
            log.error("Error retrieving overdue followup pickups: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve overdue followup pickups: " + e.getMessage()));
        }
    }
    
    /**
     * Create a followup pickup manually
     * 
     * @param request The followup pickup creation request
     * @return The created followup pickup
     * 
     * @apiExample Create followup pickup:
     * POST /api/followup-pickups
     * Content-Type: application/json
     * 
     * {
     *   "sourceRouteStopId": 123,
     *   "wardId": 1,
     *   "binId": "BIN001",
     *   "wasteType": "General",
     *   "originalDriverId": 456,
     *   "dueAt": "2024-01-15T10:00:00",
     *   "reasonCode": "MANUAL",
     *   "notes": "Manual followup creation"
     * }
     * 
     * @apiResponse 201 Success response with created followup pickup
     * @apiResponse 400 Bad request - validation errors
     * @apiResponse 500 Internal server error
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FollowupDto>> createFollowupPickup(
            @Valid @RequestBody FollowupDto request) {
        try {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(ApiResponse.error("Manual followup creation not yet implemented"));
        } catch (Exception e) {
            log.error("Error creating followup pickup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create followup pickup: " + e.getMessage()));
        }
    }
    
    /**
     * Assign driver and truck to a followup pickup
     * 
     * @param id The followup pickup ID
     * @param request The assignment request containing driver and/or truck IDs
     * @return The updated followup pickup
     * 
     * @apiExample Assign driver and truck:
     * PUT /api/followup-pickups/123/assign
     * Content-Type: application/json
     * 
     * {
     *   "newAssignedDriverId": 789,
     *   "assignedTruckId": 101
     * }
     * 
     * @apiResponse 200 Success response with updated followup pickup
     * @apiResponse 400 Bad request - validation errors
     * @apiResponse 404 Followup pickup not found
     * @apiResponse 500 Internal server error
     */
    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<FollowupDto>> assignDriverAndTruck(
            @PathVariable Integer id,
            @Valid @RequestBody FollowupDto request) {
        try {
            FollowupDto followup = followupService.assignDriverAndTruck(
                    id, request.getNewAssignedDriverId(), request.getAssignedTruckId());
            return ResponseEntity.ok(ApiResponse.success("Driver and truck assigned successfully", followup));
        } catch (Exception e) {
            log.error("Error assigning driver and truck to followup pickup {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to assign driver and truck: " + e.getMessage()));
        }
    }
    
    /**
     * Complete assignment of a followup pickup including driver, truck, collection date,
     * and updates to the route_stops table. Sets status to IN_PROGRESS.
     * 
     * @param id The followup pickup ID
     * @param request The complete assignment request with driver, truck, and collection date
     * @return Updated followup pickup response
     * 
     * @apiExample Complete followup assignment:
     * POST /api/followup-pickups/{id}/complete-assignment
     * {
     *   "newAssignedDriverId": 1,
     *   "assignedTruckId": 1,
     *   "collectionDate": "2024-01-15T08:00:00"
     * }
     * 
     * @apiResponse 200 Success response with updated followup pickup
     * @apiResponse 400 Bad request with error message
     * @apiResponse 500 Internal server error
     */
    @PostMapping("/{id}/complete-assignment")
    public ResponseEntity<ApiResponse<FollowupDto>> completeFollowupAssignment(
            @PathVariable Integer id,
            @Valid @RequestBody FollowupDto request) {
        try {
            log.info("Complete assignment request for followup ID: {}, driverId: {}, truckId: {}, collectionDate: {}", 
                id, request.getNewAssignedDriverId(), request.getAssignedTruckId(), request.getCollectionDate());
            
            FollowupDto response = followupService.completeAssignment(
                id, 
                request.getNewAssignedDriverId(), 
                request.getAssignedTruckId(),
                request.getCollectionDate()
            );
            return ResponseEntity.ok(ApiResponse.success("Followup assignment completed successfully and route_stops updated", response));
        } catch (Exception e) {
            log.error("Error completing followup assignment for ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to complete followup assignment: " + e.getMessage()));
        }
    }
    
    /**
     * Update the status of a followup pickup
     * 
     * @param id The followup pickup ID
     * @param status The new status
     * @return The updated followup pickup
     * 
     * @apiExample Update status:
     * PUT /api/followup-pickups/123/status
     * Content-Type: application/json
     * 
     * "IN_PROGRESS"
     * 
     * @apiResponse 200 Success response with updated followup pickup
     * @apiResponse 400 Bad request - invalid status
     * @apiResponse 404 Followup pickup not found
     * @apiResponse 500 Internal server error
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FollowupDto>> updateStatus(
            @PathVariable Integer id,
            @RequestBody FollowupPickup.FollowupStatus status) {
        try {
            FollowupDto followup = followupService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Status updated successfully", followup));
        } catch (Exception e) {
            log.error("Error updating status for followup pickup {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }
    
    /**
     * Mark a followup pickup as completed
     * 
     * @param id The followup pickup ID
     * @param request The completion request containing notes
     * @return The updated followup pickup
     * 
     * @apiExample Mark as completed:
     * PUT /api/followup-pickups/123/complete
     * Content-Type: application/json
     * 
     * {
     *   "completionNotes": "Collection completed successfully",
     *   "photoUrl": "https://example.com/photo.jpg"
     * }
     * 
     * @apiResponse 200 Success response with updated followup pickup
     * @apiResponse 400 Bad request - validation errors
     * @apiResponse 404 Followup pickup not found
     * @apiResponse 500 Internal server error
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<FollowupDto>> markCompleted(
            @PathVariable Integer id,
            @Valid @RequestBody FollowupDto request) {
        try {
            FollowupDto followup = followupService.markCompleted(id, request.getCompletionNotes());
            return ResponseEntity.ok(ApiResponse.success("Followup pickup marked as completed", followup));
        } catch (Exception e) {
            log.error("Error marking followup pickup {} as completed: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to mark as completed: " + e.getMessage()));
        }
    }
    
    /**
     * Cancel a followup pickup
     * 
     * @param id The followup pickup ID
     * @param reason The cancellation reason
     * @return The updated followup pickup
     * 
     * @apiExample Cancel followup:
     * DELETE /api/followup-pickups/123
     * Content-Type: application/json
     * 
     * "No longer needed - original issue resolved"
     * 
     * @apiResponse 200 Success response with updated followup pickup
     * @apiResponse 404 Followup pickup not found
     * @apiResponse 500 Internal server error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<FollowupDto>> cancelFollowup(
            @PathVariable Integer id,
            @RequestBody(required = false) String reason) {
        try {
            FollowupDto followup = followupService.cancel(id, reason);
            return ResponseEntity.ok(ApiResponse.success("Followup pickup cancelled successfully", followup));
        } catch (Exception e) {
            log.error("Error cancelling followup pickup {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to cancel followup pickup: " + e.getMessage()));
        }
    }
    
    /**
     * Process existing MISSED and SKIPPED route stops to create followups
     * This is a one-time operation to handle existing data
     * 
     * @return Success message with count of followups created
     * 
     * @apiExample Process existing missed/skipped stops:
     * POST /api/followup-pickups/process-existing
     * 
     * @apiResponse 200 Success response with count of followups created
     * @apiResponse 500 Internal server error
     */
    @PostMapping("/process-existing")
    public ResponseEntity<ApiResponse<String>> processExistingMissedSkippedStops() {
        try {
            log.info("Processing existing MISSED and SKIPPED route stops...");
            followupService.detectMissedSkippedRouteStops();
            return ResponseEntity.ok(ApiResponse.success("Successfully processed existing missed/skipped route stops", null));
        } catch (Exception e) {
            log.error("Error processing existing missed/skipped route stops: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process existing missed/skipped route stops: " + e.getMessage()));
        }
    }
    
    /**
     * Update priority and reason codes for existing followup entries based on business rules
     * 
     * @return Success message with count of followups updated
     * 
     * @apiExample Update followup priority and reason codes:
     * POST /api/followup-pickups/update-priority-reason-codes
     * 
     * @apiResponse 200 Success response with count of followups updated
     * @apiResponse 500 Internal server error
     */
    @PostMapping("/update-priority-reason-codes")
    public ResponseEntity<ApiResponse<Integer>> updateFollowupPriorityAndReasonCodes() {
        try {
            log.info("Updating followup priority and reason codes based on business rules...");
            int updatedCount = followupService.updatePriorityAndReasonCodes();
            return ResponseEntity.ok(ApiResponse.success(
                "Successfully updated " + updatedCount + " followup entries with correct priority and reason codes", 
                updatedCount));
        } catch (Exception e) {
            log.error("Error updating followup priority and reason codes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update followup priority and reason codes: " + e.getMessage()));
        }
    }
}
