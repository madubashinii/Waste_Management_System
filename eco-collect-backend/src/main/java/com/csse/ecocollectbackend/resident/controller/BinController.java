package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.entity.Bin;
import com.csse.ecocollectbackend.resident.repository.BinRepository;
import com.csse.ecocollectbackend.resident.service.BinService;
import com.csse.ecocollectbackend.login.entity.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bins")
public class BinController {

    @Autowired
    private BinService binService;

    @Autowired
    private BinRepository binRepository;

    // Register a new bin
    @PostMapping("/register")
    public ResponseEntity<Bin> registerBin(@RequestBody Bin bin, HttpSession session) {
        User resident = (User) session.getAttribute("user");
        if (resident == null) {
            return ResponseEntity.status(401).build();
        }
        Bin savedBin = binService.registerBin(bin, resident);
        return ResponseEntity.ok(savedBin);
    }

    // Get all bins for the logged-in resident
    @GetMapping("/resident")
    public ResponseEntity<List<BinDTO>> getBinsForResident(HttpSession session,
                                                           @RequestParam(required = false) String status) {
        User resident = (User) session.getAttribute("user");
        if (resident == null) {
            return ResponseEntity.status(401).build();
        }

        List<Bin> bins = binService.getBinsByResident(resident);

        // Filter by status if provided
        if (status != null && !status.isEmpty()) {
            bins = bins.stream()
                    .filter(bin -> bin.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        List<BinDTO> binDTOs = bins.stream()
                .map(bin -> new BinDTO(bin.getBinId(), bin.getStatus().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(binDTOs);
    }

    // Get all bins in system (admin or general)
    @GetMapping
    public ResponseEntity<List<BinDTO>> getAllBins(@RequestParam(required = false) String status) {
        List<Bin> bins = binRepository.findAll();

        if (status != null && !status.isEmpty()) {
            bins = bins.stream()
                    .filter(bin -> bin.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        List<BinDTO> binDTOs = bins.stream()
                .map(bin -> new BinDTO(bin.getBinId(), bin.getStatus().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(binDTOs);
    }

    // DTO class to only expose binId and status
    public record BinDTO(String binId, String status) {}
}
