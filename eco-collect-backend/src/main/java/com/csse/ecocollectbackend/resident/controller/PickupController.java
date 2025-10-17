package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.dto.PickupRequest;
import com.csse.ecocollectbackend.resident.service.impl.PickupServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pickups")

public class PickupController {

    @Autowired
    private PickupServiceImpl pickupService;

    @PostMapping
    public ResponseEntity<String> createPickup(@RequestBody PickupRequest request) {
        pickupService.createPickup(request);
        return ResponseEntity.ok("Pickup created");
    }
}

