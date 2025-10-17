package com.csse.ecocollectbackend.dispatcher.wards.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.wards.dto.CreateWardRequest;
import com.csse.ecocollectbackend.dispatcher.wards.dto.WardResponse;
import com.csse.ecocollectbackend.dispatcher.wards.service.WardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatcher/wards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class WardController {
    
    private final WardService wardService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<WardResponse>> createWard(@Valid @RequestBody CreateWardRequest request) {
        try {
            WardResponse ward = wardService.createWard(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Ward created successfully", ward));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WardResponse>>> getAllWards() {
        try {
            List<WardResponse> wards = wardService.getAllWards();
            return ResponseEntity.ok(ApiResponse.success("Wards retrieved successfully", wards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<ApiResponse<List<WardResponse>>> getWardsByZone(@PathVariable Long zoneId) {
        try {
            List<WardResponse> wards = wardService.getWardsByZone(zoneId);
            return ResponseEntity.ok(ApiResponse.success("Wards retrieved successfully", wards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{wardId}")
    public ResponseEntity<ApiResponse<WardResponse>> getWardById(@PathVariable Integer wardId) {
        try {
            WardResponse ward = wardService.getWardById(wardId);
            return ResponseEntity.ok(ApiResponse.success("Ward retrieved successfully", ward));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{wardId}")
    public ResponseEntity<ApiResponse<WardResponse>> updateWard(
            @PathVariable Integer wardId, 
            @Valid @RequestBody CreateWardRequest request) {
        try {
            WardResponse ward = wardService.updateWard(wardId, request);
            return ResponseEntity.ok(ApiResponse.success("Ward updated successfully", ward));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{wardId}")
    public ResponseEntity<ApiResponse<Void>> deleteWard(@PathVariable Integer wardId) {
        try {
            wardService.deleteWard(wardId);
            return ResponseEntity.ok(ApiResponse.success("Ward deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
