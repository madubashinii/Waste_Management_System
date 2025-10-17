package com.csse.ecocollectbackend.dispatcher.zones.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.zones.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.zones.dto.ZoneResponse;
import com.csse.ecocollectbackend.dispatcher.zones.service.ZoneService;
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
    public ResponseEntity<ApiResponse<ZoneResponse>> createZone(@Valid @RequestBody CreateZoneRequest request) {
        try {
            ZoneResponse createdZone = zoneService.createZone(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Zone created successfully", createdZone));
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
    
    @GetMapping("/{zoneName}")
    public ResponseEntity<ApiResponse<ZoneResponse>> getZoneByName(@PathVariable String zoneName) {
        try {
            ZoneResponse zone = zoneService.getZoneByName(zoneName);
            return ResponseEntity.ok(ApiResponse.success("Zone retrieved successfully", zone));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve zone: " + e.getMessage()));
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
}