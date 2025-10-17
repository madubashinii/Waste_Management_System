package com.csse.ecocollectbackend.dispatcher.zones.service.impl;

import com.csse.ecocollectbackend.dispatcher.zones.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.zones.dto.ZoneResponse;
import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import com.csse.ecocollectbackend.dispatcher.zones.repository.ZoneRepository;
import com.csse.ecocollectbackend.dispatcher.zones.service.ZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ZoneServiceImpl implements ZoneService {
    
    private final ZoneRepository zoneRepository;
    
    @Override
    public ZoneResponse createZone(CreateZoneRequest request) {
        // Validate zone name uniqueness
        if (zoneRepository.existsByZoneName(request.getZoneName())) {
            throw new IllegalArgumentException(
                String.format("Zone '%s' already exists", request.getZoneName())
            );
        }
        
        // Create and save zone
        Zone zone = new Zone(request.getZoneName());
        Zone savedZone = zoneRepository.save(zone);
        
        return new ZoneResponse(savedZone);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ZoneResponse> getAllZones() {
        return zoneRepository.findAll().stream()
            .map(ZoneResponse::new)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ZoneResponse getZoneByName(String zoneName) {
        return zoneRepository.findByZoneName(zoneName)
            .map(ZoneResponse::new)
            .orElseThrow(() -> new IllegalArgumentException(
                String.format("Zone '%s' not found", zoneName)
            ));
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean zoneExists(String zoneName) {
        return zoneRepository.existsByZoneName(zoneName);
    }
}