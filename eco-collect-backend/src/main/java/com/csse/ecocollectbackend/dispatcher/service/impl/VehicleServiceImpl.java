package com.csse.ecocollectbackend.dispatcher.service.impl;

import com.csse.ecocollectbackend.dispatcher.dto.CreateVehicleRequest;
import com.csse.ecocollectbackend.dispatcher.dto.VehicleResponse;
import com.csse.ecocollectbackend.dispatcher.entity.Vehicle;
import com.csse.ecocollectbackend.dispatcher.repository.VehicleRepository;
import com.csse.ecocollectbackend.dispatcher.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Override
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public VehicleResponse getVehicleById(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        return convertToResponse(vehicle);
    }
    
    @Override
    public VehicleResponse getVehicleByNumber(String vehicleNumber) {
        Vehicle vehicle = vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with number: " + vehicleNumber));
        return convertToResponse(vehicle);
    }
    
    @Override
    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new RuntimeException("Vehicle with number " + request.getVehicleNumber() + " already exists");
        }
        
        Vehicle vehicle = createVehicleFromRequest(request);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return convertToResponse(savedVehicle);
    }
    
    @Override
    public VehicleResponse updateVehicle(Integer id, CreateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        if (!vehicle.getVehicleNumber().equals(request.getVehicleNumber()) && 
            vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new RuntimeException("Vehicle with number " + request.getVehicleNumber() + " already exists");
        }
        
        updateVehicleFromRequest(vehicle, request);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return convertToResponse(updatedVehicle);
    }
    
    @Override
    public void deleteVehicle(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.existsByVehicleNumber(vehicleNumber);
    }
    
    private Vehicle createVehicleFromRequest(CreateVehicleRequest request) {
        return new Vehicle(request.getVehicleNumber(), request.getVehicleType(), 
                          request.getCapacity(), request.getStatus());
    }
    
    private void updateVehicleFromRequest(Vehicle vehicle, CreateVehicleRequest request) {
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setStatus(request.getStatus());
    }
    
    private VehicleResponse convertToResponse(Vehicle vehicle) {
        return new VehicleResponse(vehicle.getId(), vehicle.getVehicleNumber(), 
                                 vehicle.getVehicleType(), vehicle.getCapacity(), 
                                 vehicle.getStatus(), vehicle.getCreatedAt());
    }
}