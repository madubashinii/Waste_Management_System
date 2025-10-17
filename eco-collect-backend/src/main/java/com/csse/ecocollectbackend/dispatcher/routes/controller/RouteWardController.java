package com.csse.ecocollectbackend.dispatcher.routes.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteWardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/route-wards")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RouteWardController {
    
    private final RouteWardService routeWardService;
    
    public RouteWardController(RouteWardService routeWardService) {
        this.routeWardService = routeWardService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<RouteWardResponse>> createRouteWard(@RequestBody CreateRouteWardRequest request) {
        try {
            RouteWardResponse createdRouteWard = routeWardService.createRouteWard(request);
            
            // The route stops are automatically created in the service layer
            // when a route ward is created
            
            return ResponseEntity.ok(new ApiResponse<>(true, 
                "Route ward created successfully and route stops automatically generated", 
                createdRouteWard));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, 
                "Error creating route ward: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<List<RouteWardResponse>>> getRouteWardsByRouteId(@PathVariable Integer routeId) {
        try {
            List<RouteWardResponse> routeWards = routeWardService.getRouteWardsByRouteId(routeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route wards retrieved successfully", routeWards));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route wards: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<RouteWardResponse>>> getRouteWardsByDate(@PathVariable LocalDate date) {
        try {
            List<RouteWardResponse> routeWards = routeWardService.getRouteWardsByDate(date);
            return ResponseEntity.ok(new ApiResponse<>(true, "Route wards retrieved successfully", routeWards));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error retrieving route wards: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/route/{routeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRouteWardsByRouteId(@PathVariable Integer routeId) {
        try {
            routeWardService.deleteRouteWardsByRouteId(routeId);
            return ResponseEntity.ok(new ApiResponse<>(true, 
                "Route wards and associated route stops deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting route wards: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{routeWardId}")
    public ResponseEntity<ApiResponse<Void>> deleteRouteWard(@PathVariable Integer routeWardId) {
        try {
            routeWardService.deleteRouteWard(routeWardId);
            return ResponseEntity.ok(new ApiResponse<>(true, 
                "Route ward and associated route stops deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error deleting route ward: " + e.getMessage(), null));
        }
    }
}