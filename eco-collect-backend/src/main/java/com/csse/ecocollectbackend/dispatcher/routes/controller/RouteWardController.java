package com.csse.ecocollectbackend.dispatcher.routes.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteWardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/route-wards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RouteWardController {
    
    private final RouteWardService routeWardService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RouteWardResponse>> createRouteWard(@Valid @RequestBody CreateRouteWardRequest request) {
        try {
            RouteWardResponse routeWard = routeWardService.createRouteWard(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Route ward created successfully", routeWard));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create route ward: " + e.getMessage()));
        }
    }
    
    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<RouteWardResponse>>> getRouteWardsByRouteId(@PathVariable Integer routeId) {
        try {
            List<RouteWardResponse> routeWards = routeWardService.getRouteWardsByRouteId(routeId);
            return ResponseEntity.ok(ApiResponse.success("Route wards retrieved successfully", routeWards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve route wards: " + e.getMessage()));
        }
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<RouteWardResponse>>> getRouteWardsByDate(@PathVariable LocalDate date) {
        try {
            List<RouteWardResponse> routeWards = routeWardService.getRouteWardsByDate(date);
            return ResponseEntity.ok(ApiResponse.success("Route wards for date retrieved successfully", routeWards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve route wards for date: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<String>> deleteRouteWardsByRouteId(@PathVariable Integer routeId) {
        try {
            routeWardService.deleteRouteWardsByRouteId(routeId);
            return ResponseEntity.ok(ApiResponse.success("Route wards deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete route wards: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{routeWardId}")
    public ResponseEntity<ApiResponse<String>> deleteRouteWard(@PathVariable Integer routeWardId) {
        try {
            routeWardService.deleteRouteWard(routeWardId);
            return ResponseEntity.ok(ApiResponse.success("Route ward deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete route ward: " + e.getMessage()));
        }
    }
}
