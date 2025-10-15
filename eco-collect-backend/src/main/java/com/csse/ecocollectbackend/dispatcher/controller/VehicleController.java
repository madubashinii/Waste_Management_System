package com.csse.ecocollectbackend.dispatcher.controller;

import com.csse.ecocollectbackend.dispatcher.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.dto.CreateVehicleRequest;
import com.csse.ecocollectbackend.dispatcher.dto.VehicleResponse;
import com.csse.ecocollectbackend.dispatcher.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatcher/vehicles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAllVehicles() {
        try {
            List<VehicleResponse> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicles retrieved successfully", vehicles));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving vehicles: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Integer id) {
        try {
            VehicleResponse vehicle = vehicleService.getVehicleById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicle retrieved successfully", vehicle));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving vehicle: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/number/{vehicleNumber}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleByNumber(@PathVariable String vehicleNumber) {
        try {
            VehicleResponse vehicle = vehicleService.getVehicleByNumber(vehicleNumber);
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicle retrieved successfully", vehicle));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving vehicle: " + e.getMessage(), null));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        try {
            VehicleResponse vehicle = vehicleService.createVehicle(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Vehicle created successfully", vehicle));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating vehicle: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(@PathVariable Integer id, @Valid @RequestBody CreateVehicleRequest request) {
        try {
            VehicleResponse vehicle = vehicleService.updateVehicle(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicle updated successfully", vehicle));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating vehicle: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Integer id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicle deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error deleting vehicle: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/exists/{vehicleNumber}")
    public ResponseEntity<ApiResponse<Boolean>> checkVehicleNumberExists(@PathVariable String vehicleNumber) {
        try {
            boolean exists = vehicleService.existsByVehicleNumber(vehicleNumber);
            return ResponseEntity.ok(new ApiResponse<>(true, "Vehicle number check completed", exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error checking vehicle number: " + e.getMessage(), null));
        }
    }
}