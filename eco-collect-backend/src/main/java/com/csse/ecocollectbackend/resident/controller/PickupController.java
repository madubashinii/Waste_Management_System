package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.dto.PickupRequest;
import com.csse.ecocollectbackend.resident.service.PickupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping
    public ResponseEntity<?> createPickup(@RequestBody PickupRequest request) {
        pickupService.savePickup(request);
        return ResponseEntity.ok().body("Pickup request created successfully");
    }
}

