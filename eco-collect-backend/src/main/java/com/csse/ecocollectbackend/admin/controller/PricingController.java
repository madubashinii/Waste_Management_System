package com.csse.ecocollectbackend.admin.controller;

import com.csse.ecocollectbackend.admin.entity.PricingModel;
import com.csse.ecocollectbackend.admin.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = "http://localhost:3000")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    // Get all pricing models
    @GetMapping("/models")
    public List<PricingModel> getAllPricingModels() {
        return pricingService.getAllPricingModels();
    }

    // Get active pricing model
    @GetMapping("/models/active")
    public PricingModel getActivePricingModel() {
        return pricingService.getActivePricingModel();
    }

    // Create new pricing model
    @PostMapping("/models")
    public PricingModel createPricingModel(@RequestBody PricingModel pricingModel) {
        return pricingService.createPricingModel(pricingModel);
    }

    // Update pricing model
    @PutMapping("/models/{id}")
    public PricingModel updatePricingModel(@PathVariable Long id, @RequestBody PricingModel pricingModel) {
        return pricingService.updatePricingModel(id, pricingModel);
    }

    // Set active pricing model
    @PutMapping("/models/{id}/activate")
    public PricingModel activatePricingModel(@PathVariable Long id) {
        return pricingService.setActiveModel(id);
    }

    // Delete pricing model
    @DeleteMapping("/models/{id}")
    public ResponseEntity<?> deletePricingModel(@PathVariable Long id) {
        pricingService.deletePricingModel(id);
        return ResponseEntity.ok().body(Map.of(
                "message", "Pricing model deleted successfully"
        ));
    }

    // Save pricing configuration
    @PostMapping("/save")
    public ResponseEntity<?> savePricingConfiguration(@RequestBody Map<String, Object> config) {
        // This would handle the complete pricing configuration
        return ResponseEntity.ok().body(Map.of(
                "message", "Pricing configuration saved successfully",
                "model", config.get("selectedModel")
        ));
    }
}