package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.PickupRequest;
import org.springframework.stereotype.Service;

@Service
public class PickupService {

    public void savePickup(PickupRequest request) {
        // Here you can save to DB using repository if needed
        // For now, we just print for testing
        System.out.println("Pickup request from " + request.getUserName());
        System.out.println("Type: " + request.getPickupType());
        System.out.println("Address: " + request.getAddress());
        request.getItems().forEach(item -> {
            System.out.println(item.getType() + " - " + item.getQuantity());
        });
    }
}

