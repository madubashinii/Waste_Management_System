package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.PickupRequest;

public interface PickupService {
    void createPickup(PickupRequest request);
}
