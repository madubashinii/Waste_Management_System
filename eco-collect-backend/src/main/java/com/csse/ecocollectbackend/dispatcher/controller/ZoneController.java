package com.csse.ecocollectbackend.dispatcher.controller;

import com.csse.ecocollectbackend.dispatcher.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.dto.ZoneResponse;
import com.csse.ecocollectbackend.dispatcher.service.ZoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatcher/zones")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class ZoneController {
    
    private final ZoneService zoneService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<List<ZoneResponse>>> createZone(@Valid @RequestBody CreateZoneRequest request) {
        try {
            List<ZoneResponse> createdZones = zoneService.createZone(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Zone created successfully", createdZones));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create zone: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ZoneResponse>>> getAllZones() {
        try {
            List<ZoneResponse> zones = zoneService.getAllZones();
            return ResponseEntity.ok(ApiResponse.success("Zones retrieved successfully", zones));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve zones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/names")
    public ResponseEntity<ApiResponse<List<String>>> getAllZoneNames() {
        try {
            List<String> zoneNames = zoneService.getAllZoneNames();
            return ResponseEntity.ok(ApiResponse.success("Zone names retrieved successfully", zoneNames));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve zone names: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{zoneName}/wards")
    public ResponseEntity<ApiResponse<List<ZoneResponse>>> getWardsByZoneName(@PathVariable String zoneName) {
        try {
            List<ZoneResponse> wards = zoneService.getWardsByZoneName(zoneName);
            return ResponseEntity.ok(ApiResponse.success("Wards retrieved successfully", wards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve wards: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{zoneName}/wards/{wardNumber}")
    public ResponseEntity<ApiResponse<ZoneResponse>> getWardByZoneNameAndWardNumber(
            @PathVariable String zoneName, @PathVariable Integer wardNumber) {
        try {
            ZoneResponse ward = zoneService.getWardByZoneNameAndWardNumber(zoneName, wardNumber);
            return ResponseEntity.ok(ApiResponse.success("Ward retrieved successfully", ward));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve ward: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{zoneName}/exists")
    public ResponseEntity<ApiResponse<Boolean>> checkZoneExists(@PathVariable String zoneName) {
        try {
            boolean exists = zoneService.zoneExists(zoneName);
            return ResponseEntity.ok(ApiResponse.success("Zone existence checked", exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to check zone existence: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{zoneName}/count")
    public ResponseEntity<ApiResponse<Long>> getWardCount(@PathVariable String zoneName) {
        try {
            long count = zoneService.countWardsByZoneName(zoneName);
            return ResponseEntity.ok(ApiResponse.success("Ward count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to get ward count: " + e.getMessage()));
        }
    }
}