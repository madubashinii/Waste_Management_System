package com.csse.ecocollectbackend.collector.controller;

import com.csse.ecocollectbackend.collector.dto.CollectionUpdateRequest;
import com.csse.ecocollectbackend.collector.dto.CollectorNotificationDTO;
import com.csse.ecocollectbackend.collector.dto.CollectorRouteDTO;
import com.csse.ecocollectbackend.collector.service.CollectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collector")
@CrossOrigin(origins = {"http://localhost:5173"})
public class CollectorController {

    @Autowired
    private CollectorService collectorService;

    @GetMapping("/{collectorId}/routes/today")
    public List<CollectorRouteDTO> getTodaysRoutes(@PathVariable Integer collectorId) {
        return collectorService.getTodaysRoutes(collectorId);
    }

    @PostMapping("/collections/mark")
    public ResponseEntity<String> markBinCollected(
            @RequestParam String binId,
            @RequestParam Integer routeId,
            @RequestParam Integer collectorId,
            @RequestParam Double weightKg,
            @RequestParam String status,
            @RequestParam(required = false) MultipartFile photo
    ) throws IOException {
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            // Save the file locally or cloud storage
            String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get("uploads/" + filename);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, photo.getBytes());
            photoUrl = "/uploads/" + filename;  // store relative URL
        }

        CollectionUpdateRequest request = new CollectionUpdateRequest();
        request.setBinId(binId);
        request.setRouteId(routeId);
        request.setCollectorId(collectorId);
        request.setWeightKg(weightKg);
        request.setStatus(status);
        request.setPhotoUrl(photoUrl);

        collectorService.markBinCollected(request);
        return ResponseEntity.ok("Bin marked as " + status);
    }


    @PostMapping("/collections/report")
    public ResponseEntity<String> reportIssue(@RequestBody CollectionUpdateRequest request) {
        collectorService.reportIssue(request);
        return ResponseEntity.ok("Issue reported: " + request.getStatus());
    }

    @GetMapping("/{collectorId}/notifications")
    public List<CollectorNotificationDTO> getNotifications(@PathVariable Integer collectorId) {
        return collectorService.getNotifications(collectorId);
    }

    // Mark notification as read
    @PostMapping("/notifications/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(@PathVariable Integer notificationId) {
        boolean success = collectorService.markNotificationAsRead(notificationId);
        if (success) {
            return ResponseEntity.ok("Notification marked as read");
        } else {
            return ResponseEntity.status(404).body("Notification not found");
        }
    }
}