package com.csse.ecocollectbackend.resident.service.impl;

import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import com.csse.ecocollectbackend.resident.dto.PickupRequest;
import com.csse.ecocollectbackend.resident.entity.Bin;
import com.csse.ecocollectbackend.resident.entity.Pickup;
import com.csse.ecocollectbackend.resident.entity.Zone;
import com.csse.ecocollectbackend.resident.repository.BinRepository;
import com.csse.ecocollectbackend.resident.repository.PickupRepository;
import com.csse.ecocollectbackend.resident.repository.ZoneRepository;
import com.csse.ecocollectbackend.resident.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class PickupServiceImpl implements PickupService {

    @Autowired private BinRepository binRepo;
    @Autowired private PickupRepository pickupRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ZoneRepository zoneRepo;

    @Transactional
    @Override
    public void createPickup(PickupRequest request) {
        User resident = userRepo.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        Bin bin = null;

        if (!request.getPickupType().equalsIgnoreCase("Bulky")) {
            // Create a bin for Regular/Emergency pickup
            Zone zone = zoneRepo.findById(request.getZoneId()).orElseThrow(() -> new RuntimeException("Zone not found"));
            bin = new Bin();
            bin.setResident(resident);
            bin.setZone(zone);
            bin.setLocation(request.getAddress());
            bin.setBinType(Bin.BinType.valueOf(request.getItems().get(0).getType()));
            binRepo.save(bin);
        }

        Pickup pickup = new Pickup();
        pickup.setResident(resident);
        pickup.setBin(bin);
        pickup.setPickupType(Pickup.PickupType.valueOf(request.getPickupType()));
        pickup.setScheduledDate(LocalDate.now());
        pickup.setStatus(Pickup.PickupStatus.Pending);
        pickupRepo.save(pickup);
    }
}
