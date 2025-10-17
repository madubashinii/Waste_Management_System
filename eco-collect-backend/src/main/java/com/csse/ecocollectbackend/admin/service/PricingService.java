package com.csse.ecocollectbackend.admin.service;

import com.csse.ecocollectbackend.admin.entity.PricingModel;
import java.util.List;

public interface PricingService {
    List<PricingModel> getAllPricingModels();
    PricingModel getPricingModelById(Long id);
    PricingModel createPricingModel(PricingModel pricingModel);
    PricingModel updatePricingModel(Long id, PricingModel pricingModel);
    void deletePricingModel(Long id);
    PricingModel setActiveModel(Long id);
    PricingModel getActivePricingModel();
}