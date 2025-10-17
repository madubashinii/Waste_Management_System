package com.csse.ecocollectbackend.dispatcher.wards.service;

import com.csse.ecocollectbackend.dispatcher.wards.dto.CreateWardRequest;
import com.csse.ecocollectbackend.dispatcher.wards.dto.WardResponse;

import java.util.List;

public interface WardService {
    
    WardResponse createWard(CreateWardRequest request);
    
    List<WardResponse> getAllWards();
    
    List<WardResponse> getWardsByZone(Long zoneId);
    
    WardResponse getWardById(Integer wardId);
    
    WardResponse updateWard(Integer wardId, CreateWardRequest request);
    
    void deleteWard(Integer wardId);
}
