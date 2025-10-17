package com.csse.ecocollectbackend.dispatcher.trucks.service;

import com.csse.ecocollectbackend.dispatcher.trucks.dto.CreateTruckRequest;
import com.csse.ecocollectbackend.dispatcher.trucks.dto.TruckResponse;
import java.util.List;

public interface TruckService {
    
    List<TruckResponse> getAllTrucks();
    
    TruckResponse getTruckById(Integer truckId);
    
    TruckResponse getTruckByName(String truckName);
    
    TruckResponse createTruck(CreateTruckRequest request);
    
    TruckResponse updateTruck(Integer truckId, CreateTruckRequest request);
    
    void deleteTruck(Integer truckId);
    
    boolean existsByTruckName(String truckName);
}
