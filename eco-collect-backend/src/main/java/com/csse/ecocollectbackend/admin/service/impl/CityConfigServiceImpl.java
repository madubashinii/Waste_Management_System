package com.csse.ecocollectbackend.admin.service.impl;

import com.csse.ecocollectbackend.admin.entity.Zone;
import com.csse.ecocollectbackend.admin.entity.WasteType;
import com.csse.ecocollectbackend.admin.entity.User;
import com.csse.ecocollectbackend.admin.entity.Truck;
import com.csse.ecocollectbackend.admin.repository.ZoneRepository;
import com.csse.ecocollectbackend.admin.repository.WasteTypeRepository;
import com.csse.ecocollectbackend.admin.repository.UserRepository;
import com.csse.ecocollectbackend.admin.repository.TruckRepository;
import com.csse.ecocollectbackend.admin.service.CityConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CityConfigServiceImpl implements CityConfigService {

    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private WasteTypeRepository wasteTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TruckRepository truckRepository;

    // ===== ZONE METHODS =====
    @Override
    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    @Override
    public Zone createZone(Zone zone) {
        zone.setCreatedAt(LocalDateTime.now());
        return zoneRepository.save(zone);
    }

    @Override
    public void deleteZone(Long id) {
        zoneRepository.deleteById(id);
    }

    // ===== WASTE TYPE METHODS =====
    @Override
    public List<WasteType> getAllWasteTypes() {
        return wasteTypeRepository.findAll();
    }

    @Override
    public WasteType createWasteType(WasteType wasteType) {
        wasteType.setCreatedAt(LocalDateTime.now());
        return wasteTypeRepository.save(wasteType);
    }

    @Override
    public WasteType updateWasteType(Long id, WasteType wasteType) {
        WasteType existingWasteType = wasteTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Waste type not found"));

        existingWasteType.setName(wasteType.getName());
        existingWasteType.setRecyclable(wasteType.getRecyclable());

        return wasteTypeRepository.save(existingWasteType);
    }

    @Override
    public WasteType toggleRecyclable(Long id) {
        WasteType wasteType = wasteTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Waste type not found"));

        wasteType.setRecyclable(!wasteType.getRecyclable());
        return wasteTypeRepository.save(wasteType);
    }

    @Override
    public void deleteWasteType(Long id) {
        wasteTypeRepository.deleteById(id);
    }

    // ===== TRUCK METHODS =====
    @Override
    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    @Override
    public Truck createTruck(Truck truck) {
        truck.setCreatedAt(LocalDateTime.now());
        return truckRepository.save(truck);
    }

    @Override
    public void deleteTruck(Long id) {
        truckRepository.deleteById(id);
    }

    // ===== USER METHODS =====
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}