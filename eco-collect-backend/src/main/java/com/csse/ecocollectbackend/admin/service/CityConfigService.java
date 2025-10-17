package com.csse.ecocollectbackend.admin.service;

import com.csse.ecocollectbackend.admin.entity.Zone;
import com.csse.ecocollectbackend.admin.entity.WasteType;
import com.csse.ecocollectbackend.admin.entity.User;
import com.csse.ecocollectbackend.admin.entity.Truck;
import java.util.List;

public interface CityConfigService {

    // Zone methods
    List<Zone> getAllZones();
    Zone createZone(Zone zone);
    void deleteZone(Long id);

    // Waste Type methods
    List<WasteType> getAllWasteTypes();
    WasteType createWasteType(WasteType wasteType);
    WasteType updateWasteType(Long id, WasteType wasteType);
    WasteType toggleRecyclable(Long id);
    void deleteWasteType(Long id);

    // Truck methods
    List<Truck> getAllTrucks();
    Truck createTruck(Truck truck);
    void deleteTruck(Long id);

    // User methods
    List<User> getAllUsers();
    User createUser(User user);
    void deleteUser(Long id);
}