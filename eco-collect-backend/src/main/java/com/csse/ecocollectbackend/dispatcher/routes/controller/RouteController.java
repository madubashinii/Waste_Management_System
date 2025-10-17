package com.csse.ecocollectbackend.dispatcher.routes.controller;

import com.csse.ecocollectbackend.dispatcher.common.dto.ApiResponse;
import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RouteController {
    
    private final RouteService routeService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody CreateRouteRequest request) {
        try {
            RouteResponse route = routeService.createRoute(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Route created successfully", route));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create route: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        try {
            List<RouteResponse> routes = routeService.getAllRoutes();
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable Integer routeId) {
        try {
            return routeService.getRouteById(routeId)
                    .map(route -> ResponseEntity.ok(ApiResponse.success("Route retrieved successfully", route)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(ApiResponse.error("Route not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve route: " + e.getMessage()));
        }
    }
    
    @GetMapping("/dispatcher/{dispatcherId}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByDispatcher(@PathVariable Integer dispatcherId) {
        try {
            List<RouteResponse> routes = routeService.getRoutesByDispatcher(dispatcherId);
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @GetMapping("/collector/{collectorId}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByCollector(@PathVariable Integer collectorId) {
        try {
            List<RouteResponse> routes = routeService.getRoutesByCollector(collectorId);
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByZone(@PathVariable Long zoneId) {
        try {
            List<RouteResponse> routes = routeService.getRoutesByZone(zoneId);
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByDate(@PathVariable LocalDate date) {
        try {
            List<RouteResponse> routes = routeService.getRoutesByDate(date);
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getRoutesByStatus(@PathVariable Route.RouteStatus status) {
        try {
            List<RouteResponse> routes = routeService.getRoutesByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve routes: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{routeId}/status")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRouteStatus(
            @PathVariable Integer routeId, 
            @RequestParam Route.RouteStatus status) {
        try {
            RouteResponse route = routeService.updateRouteStatus(routeId, status);
            return ResponseEntity.ok(ApiResponse.success("Route status updated successfully", route));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update route status: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{routeId}/assign-collector")
    public ResponseEntity<ApiResponse<RouteResponse>> assignCollector(
            @PathVariable Integer routeId, 
            @RequestParam Integer collectorId) {
        try {
            RouteResponse route = routeService.assignCollector(routeId, collectorId);
            return ResponseEntity.ok(ApiResponse.success("Collector assigned successfully", route));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to assign collector: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{routeId}/assign-truck")
    public ResponseEntity<ApiResponse<RouteResponse>> assignTruck(
            @PathVariable Integer routeId, 
            @RequestParam Integer truckId) {
        try {
            RouteResponse route = routeService.assignTruck(routeId, truckId);
            return ResponseEntity.ok(ApiResponse.success("Truck assigned successfully", route));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to assign truck: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{routeId}")
    public ResponseEntity<ApiResponse<String>> deleteRoute(@PathVariable Integer routeId) {
        try {
            routeService.deleteRoute(routeId);
            return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete route: " + e.getMessage()));
        }
    }
}