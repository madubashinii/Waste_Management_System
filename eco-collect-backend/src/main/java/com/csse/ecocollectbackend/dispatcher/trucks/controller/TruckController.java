package com.csse.ecocollectbackend.dispatcher.trucks.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.trucks.dto.CreateTruckRequest;
import com.csse.ecocollectbackend.dispatcher.trucks.dto.TruckResponse;
import com.csse.ecocollectbackend.dispatcher.trucks.service.TruckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatcher/trucks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class TruckController {
    
    private final TruckService truckService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TruckResponse>>> getAllTrucks() {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Trucks retrieved successfully", truckService.getAllTrucks()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving trucks: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{truckId}")
    public ResponseEntity<ApiResponse<TruckResponse>> getTruckById(@PathVariable Integer truckId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Truck retrieved successfully", truckService.getTruckById(truckId)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving truck: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/name/{truckName}")
    public ResponseEntity<ApiResponse<TruckResponse>> getTruckByName(@PathVariable String truckName) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Truck retrieved successfully", truckService.getTruckByName(truckName)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving truck: " + e.getMessage(), null));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<TruckResponse>> createTruck(@Valid @RequestBody CreateTruckRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Truck created successfully", truckService.createTruck(request)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating truck: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{truckId}")
    public ResponseEntity<ApiResponse<TruckResponse>> updateTruck(@PathVariable Integer truckId, @Valid @RequestBody CreateTruckRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Truck updated successfully", truckService.updateTruck(truckId, request)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating truck: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{truckId}")
    public ResponseEntity<ApiResponse<Void>> deleteTruck(@PathVariable Integer truckId) {
        try {
            truckService.deleteTruck(truckId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Truck deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error deleting truck: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/exists/{truckName}")
    public ResponseEntity<ApiResponse<Boolean>> checkTruckNameExists(@PathVariable String truckName) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Truck name check completed", truckService.existsByTruckName(truckName)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error checking truck name: " + e.getMessage(), null));
        }
    }
}
