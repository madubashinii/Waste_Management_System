package com.csse.ecocollectbackend.dispatcher.wards.service.impl;

import com.csse.ecocollectbackend.dispatcher.wards.dto.CreateWardRequest;
import com.csse.ecocollectbackend.dispatcher.wards.dto.WardResponse;
import com.csse.ecocollectbackend.dispatcher.wards.entity.Ward;
import com.csse.ecocollectbackend.dispatcher.wards.repository.WardRepository;
import com.csse.ecocollectbackend.dispatcher.wards.service.WardService;
import com.csse.ecocollectbackend.dispatcher.zones.entity.Zone;
import com.csse.ecocollectbackend.dispatcher.zones.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WardServiceImpl implements WardService {
    
    private final WardRepository wardRepository;
    private final ZoneRepository zoneRepository;
    
    @Override
    public WardResponse createWard(CreateWardRequest request) {
        // Validate zone exists
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zone not found with ID: " + request.getZoneId()));
        
        // Check if ward number already exists in the zone
        if (wardRepository.existsByZoneZoneIdAndWardNumber(request.getZoneId(), request.getWardNumber())) {
            throw new RuntimeException("Ward number " + request.getWardNumber() + 
                    " already exists in zone " + zone.getZoneName());
        }
        
        Ward ward = new Ward(zone, request.getWardNumber(), request.getWardName());
        Ward savedWard = wardRepository.save(ward);
        
        return WardResponse.fromEntity(savedWard);
    }
    
    @Override
    public List<WardResponse> getAllWards() {
        return wardRepository.findAll().stream()
                .map(WardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WardResponse> getWardsByZone(Long zoneId) {
        // Validate zone exists
        if (!zoneRepository.existsById(zoneId)) {
            throw new RuntimeException("Zone not found with ID: " + zoneId);
        }
        
        return wardRepository.findByZoneZoneId(zoneId).stream()
                .map(WardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public WardResponse getWardById(Integer wardId) {
        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new RuntimeException("Ward not found with ID: " + wardId));
        
        return WardResponse.fromEntity(ward);
    }
    
    @Override
    public WardResponse updateWard(Integer wardId, CreateWardRequest request) {
        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new RuntimeException("Ward not found with ID: " + wardId));
        
        // Validate zone exists
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zone not found with ID: " + request.getZoneId()));
        
        // Check if ward number already exists in the zone (excluding current ward)
        if (wardRepository.existsByZoneZoneIdAndWardNumber(request.getZoneId(), request.getWardNumber()) 
                && !ward.getZone().getZoneId().equals(request.getZoneId()) || !ward.getWardNumber().equals(request.getWardNumber())) {
            throw new RuntimeException("Ward number " + request.getWardNumber() + 
                    " already exists in zone " + zone.getZoneName());
        }
        
        ward.setZone(zone);
        ward.setWardNumber(request.getWardNumber());
        ward.setWardName(request.getWardName());
        
        Ward savedWard = wardRepository.save(ward);
        return WardResponse.fromEntity(savedWard);
    }
    
    @Override
    public void deleteWard(Integer wardId) {
        if (!wardRepository.existsById(wardId)) {
            throw new RuntimeException("Ward not found with ID: " + wardId);
        }
        
        wardRepository.deleteById(wardId);
    }
}
