package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.entity.Zone;
import com.csse.ecocollectbackend.resident.repository.ZoneRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneRepository zoneRepository;

    public ZoneController(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    @GetMapping
    public List<Zone> getZones() {
        return zoneRepository.findAll();
    }
}
