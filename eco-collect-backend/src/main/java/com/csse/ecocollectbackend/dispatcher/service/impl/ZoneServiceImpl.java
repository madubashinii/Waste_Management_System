package com.csse.ecocollectbackend.dispatcher.service.impl;

import com.csse.ecocollectbackend.dispatcher.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.dto.ZoneResponse;
import com.csse.ecocollectbackend.dispatcher.entity.Zone;
import com.csse.ecocollectbackend.dispatcher.repository.ZoneRepository;
import com.csse.ecocollectbackend.dispatcher.service.ZoneService;
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
    public List<ZoneResponse> createZone(CreateZoneRequest request) {
        // Validate ward uniqueness
        request.getWards().forEach(ward -> {
            if (zoneRepository.existsByZoneNameAndWardNumber(request.getZoneName(), ward.getWardNumber())) {
                throw new IllegalArgumentException(
                    String.format("Ward %d already exists in zone '%s'", ward.getWardNumber(), request.getZoneName())
                );
            }
        });
        
        // Create and save zones
        List<Zone> zones = request.getWards().stream()
            .map(ward -> new Zone(request.getZoneName(), ward.getWardNumber(), ward.getWardName()))
            .collect(Collectors.toList());
        
        return zoneRepository.saveAll(zones).stream()
            .map(ZoneResponse::new)
            .collect(Collectors.toList());
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
    public List<String> getAllZoneNames() {
        return zoneRepository.findDistinctZoneNames();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ZoneResponse> getWardsByZoneName(String zoneName) {
        return zoneRepository.findWardsByZoneName(zoneName).stream()
            .map(ZoneResponse::new)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ZoneResponse getWardByZoneNameAndWardNumber(String zoneName, Integer wardNumber) {
        return zoneRepository.findByZoneNameAndWardNumber(zoneName, wardNumber)
            .map(ZoneResponse::new)
            .orElseThrow(() -> new IllegalArgumentException(
                String.format("Ward %d not found in zone '%s'", wardNumber, zoneName)
            ));
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean zoneExists(String zoneName) {
        return !zoneRepository.findByZoneName(zoneName).isEmpty();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean wardExists(String zoneName, Integer wardNumber) {
        return zoneRepository.existsByZoneNameAndWardNumber(zoneName, wardNumber);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countWardsByZoneName(String zoneName) {
        return zoneRepository.countWardsByZoneName(zoneName);
    }
}