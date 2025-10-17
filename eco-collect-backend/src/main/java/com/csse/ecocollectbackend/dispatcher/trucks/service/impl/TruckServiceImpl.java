package com.csse.ecocollectbackend.dispatcher.trucks.service.impl;

import com.csse.ecocollectbackend.dispatcher.trucks.dto.CreateTruckRequest;
import com.csse.ecocollectbackend.dispatcher.trucks.dto.TruckResponse;
import com.csse.ecocollectbackend.dispatcher.trucks.entity.Truck;
import com.csse.ecocollectbackend.dispatcher.trucks.repository.TruckRepository;
import com.csse.ecocollectbackend.dispatcher.trucks.service.TruckService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TruckServiceImpl implements TruckService {
    
    private final TruckRepository truckRepository;
    
    @Override
    public List<TruckResponse> getAllTrucks() {
        return truckRepository.findAll().stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    @Override
    public TruckResponse getTruckById(Integer truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + truckId));
        return convertToResponse(truck);
    }
    
    @Override
    public TruckResponse getTruckByName(String truckName) {
        Truck truck = truckRepository.findByTruckName(truckName)
                .orElseThrow(() -> new RuntimeException("Truck not found with name: " + truckName));
        return convertToResponse(truck);
    }
    
    @Override
    public TruckResponse createTruck(CreateTruckRequest request) {
        if (truckRepository.existsByTruckName(request.getTruckName())) {
            throw new RuntimeException("Truck with name " + request.getTruckName() + " already exists");
        }
        
        Truck truck = new Truck(null, request.getTruckName(), request.getTruckType(), 
                               request.getCapacityKg(), request.getStatus(), null);
        return convertToResponse(truckRepository.save(truck));
    }
    
    @Override
    public TruckResponse updateTruck(Integer truckId, CreateTruckRequest request) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + truckId));
        
        if (!truck.getTruckName().equals(request.getTruckName()) && 
            truckRepository.existsByTruckName(request.getTruckName())) {
            throw new RuntimeException("Truck with name " + request.getTruckName() + " already exists");
        }
        
        truck.setTruckName(request.getTruckName());
        truck.setTruckType(request.getTruckType());
        truck.setCapacityKg(request.getCapacityKg());
        truck.setStatus(request.getStatus());
        
        return convertToResponse(truckRepository.save(truck));
    }
    
    @Override
    public void deleteTruck(Integer truckId) {
        if (!truckRepository.existsById(truckId)) {
            throw new RuntimeException("Truck not found with id: " + truckId);
        }
        truckRepository.deleteById(truckId);
    }
    
    @Override
    public boolean existsByTruckName(String truckName) {
        return truckRepository.existsByTruckName(truckName);
    }
    
    private TruckResponse convertToResponse(Truck truck) {
        return new TruckResponse(truck.getTruckId(), truck.getTruckName(), 
                               truck.getTruckType(), truck.getCapacityKg(), 
                               truck.getStatus(), truck.getCreatedAt());
    }
}
