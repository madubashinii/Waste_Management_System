package com.csse.ecocollectbackend.admin.controller;

import com.csse.ecocollectbackend.admin.entity.Zone;
import com.csse.ecocollectbackend.admin.entity.WasteType;
import com.csse.ecocollectbackend.admin.entity.User;
import com.csse.ecocollectbackend.admin.entity.Truck;
import com.csse.ecocollectbackend.admin.service.CityConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/city-config")
@CrossOrigin(origins = "http://localhost:3000")
public class CityConfigController {

    @Autowired
    private CityConfigService cityConfigService;

    // ===== ZONE MANAGEMENT =====

    @GetMapping("/zones")
    public List<Zone> getAllZones() {
        return cityConfigService.getAllZones();
    }

    @PostMapping("/zones")
    public Zone createZone(@RequestBody Zone zone) {
        return cityConfigService.createZone(zone);
    }

    @DeleteMapping("/zones/{id}")
    public ResponseEntity<?> deleteZone(@PathVariable Long id) {
        cityConfigService.deleteZone(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "Zone deleted successfully"
        ));
    }

    // ===== WASTE TYPE MANAGEMENT =====

    @GetMapping("/waste-types")
    public List<WasteType> getAllWasteTypes() {
        return cityConfigService.getAllWasteTypes();
    }

    @PostMapping("/waste-types")
    public WasteType createWasteType(@RequestBody WasteType wasteType) {
        return cityConfigService.createWasteType(wasteType);
    }

    @PutMapping("/waste-types/{id}")
    public WasteType updateWasteType(@PathVariable Long id, @RequestBody WasteType wasteType) {
        return cityConfigService.updateWasteType(id, wasteType);
    }

    @PutMapping("/waste-types/{id}/toggle-recyclable")
    public WasteType toggleRecyclable(@PathVariable Long id) {
        return cityConfigService.toggleRecyclable(id);
    }

    @DeleteMapping("/waste-types/{id}")
    public ResponseEntity<?> deleteWasteType(@PathVariable Long id) {
        cityConfigService.deleteWasteType(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "Waste type deleted successfully"
        ));
    }

    // ===== TRUCK MANAGEMENT =====

    @GetMapping("/trucks")
    public List<Truck> getAllTrucks() {
        return cityConfigService.getAllTrucks();
    }

    @PostMapping("/trucks")
    public Truck createTruck(@RequestBody Truck truck) {
        return cityConfigService.createTruck(truck);
    }

    @DeleteMapping("/trucks/{id}")
    public ResponseEntity<?> deleteTruck(@PathVariable Long id) {
        cityConfigService.deleteTruck(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "Truck deleted successfully"
        ));
    }

    // ===== USER MANAGEMENT =====

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return cityConfigService.getAllUsers();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return cityConfigService.createUser(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        cityConfigService.deleteUser(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "User deleted successfully"
        ));
    }
}