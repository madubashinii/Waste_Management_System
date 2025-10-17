package com.csse.ecocollectbackend.admin.service.impl;

import com.csse.ecocollectbackend.admin.entity.PricingModel;
import com.csse.ecocollectbackend.admin.repository.PricingModelRepository;
import com.csse.ecocollectbackend.admin.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PricingServiceImpl implements PricingService {

    @Autowired
    private PricingModelRepository pricingModelRepository;

    @Override
    public List<PricingModel> getAllPricingModels() {
        return pricingModelRepository.findAll();
    }

    @Override
    public PricingModel getPricingModelById(Long id) {
        return pricingModelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing model not found with id: " + id));
    }

    @Override
    public PricingModel createPricingModel(PricingModel pricingModel) {
        pricingModel.setCreatedAt(LocalDateTime.now());
        pricingModel.setUpdatedAt(LocalDateTime.now());
        return pricingModelRepository.save(pricingModel);
    }

    @Override
    public PricingModel updatePricingModel(Long id, PricingModel pricingModel) {
        PricingModel existing = getPricingModelById(id);
        existing.setName(pricingModel.getName());
        existing.setDescription(pricingModel.getDescription());
        existing.setConfiguration(pricingModel.getConfiguration());
        existing.setUpdatedAt(LocalDateTime.now());
        return pricingModelRepository.save(existing);
    }

    @Override
    public void deletePricingModel(Long id) {
        pricingModelRepository.deleteById(id);
    }

    @Override
    public PricingModel setActiveModel(Long id) {
        // Deactivate all models first
        List<PricingModel> allModels = pricingModelRepository.findAll();
        for (PricingModel model : allModels) {
            model.setIsActive(false);
        }
        pricingModelRepository.saveAll(allModels);

        // Activate the selected model
        PricingModel activeModel = getPricingModelById(id);
        activeModel.setIsActive(true);
        activeModel.setUpdatedAt(LocalDateTime.now());
        return pricingModelRepository.save(activeModel);
    }

    @Override
    public PricingModel getActivePricingModel() {
        List<PricingModel> activeModels = pricingModelRepository.findByIsActive(true);
        return activeModels.isEmpty() ? null : activeModels.get(0);
    }
}