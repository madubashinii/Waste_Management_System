package com.csse.ecocollectbackend.dispatcher.routes.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteStopResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteStopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/route-stops")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RouteStopController {
    
    private final RouteStopService routeStopService;
    
    public RouteStopController(RouteStopService routeStopService) {
        this.routeStopService = routeStopService;
    }
    
    // Helper method to convert RouteStop entity to RouteStopResponse DTO
    private RouteStopResponse convertToResponse(RouteStop routeStop) {
        RouteStopResponse response = new RouteStopResponse();
        response.setStopId(routeStop.getStopId());
        response.setRouteId(routeStop.getRoute() != null ? routeStop.getRoute().getRouteId() : null);
        response.setCollectionDate(routeStop.getRoute() != null ? routeStop.getRoute().getCollectionDate() : null);
        response.setBinId(routeStop.getBinId());
        response.setDriverId(routeStop.getDriver() != null ? routeStop.getDriver().getUserId() : null);
        response.setDriverName(routeStop.getDriver() != null ? routeStop.getDriver().getName() : null);
        response.setResidentId(routeStop.getResident() != null ? routeStop.getResident().getUserId() : null);
        response.setResidentName(routeStop.getResident() != null ? routeStop.getResident().getName() : null);
        response.setStopOrder(routeStop.getStopOrder());
        response.setCollected(routeStop.getCollected());
        response.setPhotoUrl(routeStop.getPhotoUrl());
        response.setPlannedEta(routeStop.getPlannedEta());
        response.setArrivedAt(routeStop.getArrivedAt());
        response.setStatus(routeStop.getStatus() != null ? routeStop.getStatus().name() : null);
        response.setReassignedToDriverId(routeStop.getReassignedToDriver() != null ? routeStop.getReassignedToDriver().getUserId() : null);
        response.setReassignedToDriverName(routeStop.getReassignedToDriver() != null ? routeStop.getReassignedToDriver().getName() : null);
        response.setReasonCode(routeStop.getReasonCode() != null ? routeStop.getReasonCode().name() : null);
        response.setSource(routeStop.getSource() != null ? routeStop.getSource().name() : null);
        response.setWeightKg(routeStop.getWeightKg());
        response.setNotes(routeStop.getNotes());
        response.setCreatedAt(routeStop.getCreatedAt());
        response.setUpdatedAt(routeStop.getUpdatedAt());
        return response;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<RouteStop>> createRouteStop(@RequestBody RouteStop routeStop) {
        try {
            RouteStop createdRouteStop = routeStopService.createRouteStop(routeStop);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop created successfully", createdRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error creating route stop: " + e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteStopResponse>>> getAllRouteStops() {
        try {
            List<RouteStop> routeStops = routeStopService.getAllRouteStops();
            List<RouteStopResponse> responseList = routeStops.stream()
                .map(this::convertToResponse)
                .toList();
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", responseList));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error for debugging
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{stopId}")
    public ResponseEntity<ApiResponse<RouteStop>> getRouteStopById(@PathVariable Integer stopId) {
        try {
            Optional<RouteStop> routeStop = routeStopService.getRouteStopById(stopId);
            if (routeStop.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Route stop retrieved successfully", routeStop.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stop: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<RouteStopResponse>>> getRouteStopsByRouteId(@PathVariable Integer routeId) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByRouteIdOrdered(routeId);
            List<RouteStopResponse> responseList = routeStops.stream()
                .map(this::convertToResponse)
                .toList();
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", responseList));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error for debugging
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByDriverId(@PathVariable Integer driverId) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByDriverId(driverId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/driver/{driverId}/status/{status}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByDriverIdAndStatus(
            @PathVariable Integer driverId, @PathVariable RouteStop.StopStatus status) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByDriverIdAndStatus(driverId, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/bin/{binId}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByBinId(@PathVariable Integer binId) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByBinId(binId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByStatus(@PathVariable RouteStop.StopStatus status) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByStatus(status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/route/{routeId}/collected/{collected}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByRouteAndCollected(
            @PathVariable Integer routeId, @PathVariable Boolean collected) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByRouteAndCollected(routeId, collected);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/route/{routeId}/status/{status}")
    public ResponseEntity<ApiResponse<List<RouteStop>>> getRouteStopsByRouteAndStatus(
            @PathVariable Integer routeId, @PathVariable RouteStop.StopStatus status) {
        try {
            List<RouteStop> routeStops = routeStopService.getRouteStopsByRouteAndStatus(routeId, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops retrieved successfully", routeStops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/count/route/{routeId}")
    public ResponseEntity<ApiResponse<Long>> countRouteStopsByRouteId(@PathVariable Integer routeId) {
        try {
            Long count = routeStopService.countRouteStopsByRouteId(routeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stops count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route stops count: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/count/route/{routeId}/collected")
    public ResponseEntity<ApiResponse<Long>> countCollectedRouteStopsByRouteId(@PathVariable Integer routeId) {
        try {
            Long count = routeStopService.countCollectedRouteStopsByRouteId(routeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Collected route stops count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving collected route stops count: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStop(@PathVariable Integer stopId, @RequestBody RouteStop routeStop) {
        try {
            routeStop.setStopId(stopId);
            RouteStop updatedRouteStop = routeStopService.updateRouteStop(routeStop);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/status")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopStatus(
            @PathVariable Integer stopId, @RequestParam RouteStop.StopStatus status) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopStatus(stopId, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop status updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop status: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/collected")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopCollected(
            @PathVariable Integer stopId, @RequestParam Boolean collected) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopCollected(stopId, collected);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop collected status updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop collected status: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/arrived")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopArrivedAt(
            @PathVariable Integer stopId, @RequestParam LocalDateTime arrivedAt) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopArrivedAt(stopId, arrivedAt);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop arrived time updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop arrived time: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/photo")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopPhoto(
            @PathVariable Integer stopId, @RequestParam String photoUrl) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopPhoto(stopId, photoUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop photo updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop photo: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/weight")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopWeight(
            @PathVariable Integer stopId, @RequestParam BigDecimal weightKg) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopWeight(stopId, weightKg);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop weight updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop weight: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/notes")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopNotes(
            @PathVariable Integer stopId, @RequestParam String notes) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopNotes(stopId, notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop notes updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop notes: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/reason")
    public ResponseEntity<ApiResponse<RouteStop>> updateRouteStopReasonCode(
            @PathVariable Integer stopId, @RequestParam RouteStop.ReasonCode reasonCode) {
        try {
            RouteStop updatedRouteStop = routeStopService.updateRouteStopReasonCode(stopId, reasonCode);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop reason code updated successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error updating route stop reason code: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{stopId}/reassign")
    public ResponseEntity<ApiResponse<RouteStop>> reassignRouteStop(
            @PathVariable Integer stopId, @RequestParam Integer newDriverId) {
        try {
            RouteStop updatedRouteStop = routeStopService.reassignRouteStop(stopId, newDriverId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop reassigned successfully", updatedRouteStop));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error reassigning route stop: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{stopId}")
    public ResponseEntity<ApiResponse<Void>> deleteRouteStop(@PathVariable Integer stopId) {
        try {
            routeStopService.deleteRouteStop(stopId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route stop deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting route stop: " + e.getMessage(), null));
        }
    }
}
