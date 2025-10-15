package com.csse.ecocollectbackend.dispatcher.service;

import com.csse.ecocollectbackend.dispatcher.dto.CreateVehicleRequest;
import com.csse.ecocollectbackend.dispatcher.dto.VehicleResponse;
import java.util.List;

public interface VehicleService {
    
    List<VehicleResponse> getAllVehicles();
    
    VehicleResponse getVehicleById(Integer id);
    
    VehicleResponse getVehicleByNumber(String vehicleNumber);
    
    VehicleResponse createVehicle(CreateVehicleRequest request);
    
    VehicleResponse updateVehicle(Integer id, CreateVehicleRequest request);
    
    void deleteVehicle(Integer id);
    
    boolean existsByVehicleNumber(String vehicleNumber);
}
