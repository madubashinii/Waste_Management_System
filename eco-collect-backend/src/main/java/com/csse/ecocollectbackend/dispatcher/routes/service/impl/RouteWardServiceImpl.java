package com.csse.ecocollectbackend.dispatcher.routes.service.impl;

import com.csse.ecocollectbackend.dispatcher.routes.dto.CreateRouteWardRequest;
import com.csse.ecocollectbackend.dispatcher.routes.dto.RouteWardResponse;
import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteWard;
import com.csse.ecocollectbackend.dispatcher.routes.entity.RouteStop;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteRepository;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteWardRepository;
import com.csse.ecocollectbackend.dispatcher.routes.repository.RouteStopRepository;
import com.csse.ecocollectbackend.dispatcher.routes.service.RouteWardService;
import com.csse.ecocollectbackend.resident.entity.Bin;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteWardServiceImpl implements RouteWardService {
    
    private final RouteWardRepository routeWardRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    
    @Override
    public RouteWardResponse createRouteWard(CreateRouteWardRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        RouteWard routeWard = new RouteWard(
            route, 
            request.getWardNumber(), 
            request.getWardName(), 
            request.getWardOrder()
        );
        
        RouteWard savedRouteWard = routeWardRepository.save(routeWard);
        
        // Automatically create route stops for all bins in this ward
        createRouteStopsForWard(savedRouteWard, request.getWardNumber());
        
        return RouteWardResponse.fromEntity(savedRouteWard);
    }
    
    /**
     * Creates route stops for all ACTIVE bins in the specified ward
     * This method automatically creates route stops based on the mockBinsData.js structure
     * Only bins with status = 'Active' will have route stops created
  
     */
    private void createRouteStopsForWard(RouteWard routeWard, Integer wardNumber) {
        // Get all ACTIVE bins for this ward from mockBinsData.js structure
        // In a real application, you would query: SELECT bin_id FROM bins WHERE ward_id = wardNumber AND status = 'Active'
        List<String> binIds = getActiveBinIdsForWard(wardNumber);
        
        int stopOrder = 1;
        for (String binId : binIds) {
            RouteStop routeStop = new RouteStop();
            routeStop.setRoute(routeWard.getRoute());
            Bin bin = new Bin();
            bin.setBinId(String.valueOf(Integer.valueOf(binId)));
            routeStop.setBin(bin);
            routeStop.setStopOrder(stopOrder);
            routeStop.setCollected(false);
            routeStop.setStatus(RouteStop.StopStatus.PENDING);
            routeStop.setReasonCode(RouteStop.ReasonCode.NONE);
            routeStop.setSource(RouteStop.Source.MANUAL);
            routeStop.setWeightKg(BigDecimal.ZERO);
            
            // Set planned ETA based on ward order and stop order
            LocalDateTime plannedEta = calculatePlannedEta(routeWard.getWardOrder(), stopOrder);
            routeStop.setPlannedEta(plannedEta);
            
            routeStopRepository.save(routeStop);
            stopOrder++;
        }
    }
    
    /**
     * Gets active bin IDs for a specific ward

     * Only returns bins with status = 'Active'
     */
    private List<String> getActiveBinIdsForWard(Integer wardNumber) {
        // Mock data structure matching mockBinsData.js
        // Each ward has 5 bins, but only Active bins should have route stops
        List<String> activeBinIds = new java.util.ArrayList<>();
        
        // Calculate bin ID range for this ward (each ward has 5 bins)
        int startBinId = (wardNumber - 1) * 5 + 1;
        int endBinId = wardNumber * 5;
        
        // Based on mockBinsData.js, filter only Active bins
        for (int binId = startBinId; binId <= endBinId; binId++) {
            String binStatus = getBinStatusFromMockData(binId);
            if ("Active".equals(binStatus)) {
                activeBinIds.add(String.valueOf(binId));
            }
        }
        
        return activeBinIds;
    }
    
    /**
     * Returns the status of a bin based on mockBinsData.js structure
     * This mirrors the actual bin statuses from the frontend mock data
     */
    private String getBinStatusFromMockData(Integer binId) {
        // This method returns the status based on the actual mockBinsData.js structure
        // Ward 1: bins 1-5 (all Active)
        if (binId >= 1 && binId <= 5) {
            return "Active";
        }
        // Ward 2: bins 6-10 (4 Active, 1 Inactive)
        else if (binId >= 6 && binId <= 10) {
            if (binId == 9) return "Inactive"; // bin_id: 9 is Inactive
            return "Active";
        }
        // Ward 3: bins 11-15 (4 Active, 1 Missing)
        else if (binId >= 11 && binId <= 15) {
            if (binId == 14) return "Missing"; // bin_id: 14 is Missing
            return "Active";
        }
        // Ward 4: bins 16-20 (all Active)
        else if (binId >= 16 && binId <= 20) {
            return "Active";
        }
        // Ward 5: bins 21-25 (4 Active, 1 Inactive)
        else if (binId >= 21 && binId <= 25) {
            if (binId == 24) return "Inactive"; // bin_id: 24 is Inactive
            return "Active";
        }
        // Ward 6: bins 26-30 (4 Active, 1 Missing)
        else if (binId >= 26 && binId <= 30) {
            if (binId == 30) return "Missing"; // bin_id: 30 is Missing
            return "Active";
        }
        // Ward 7: bins 31-35 (all Active)
        else if (binId >= 31 && binId <= 35) {
            return "Active";
        }
        // Ward 8: bins 36-40 (4 Active, 1 Inactive)
        else if (binId >= 36 && binId <= 40) {
            if (binId == 39) return "Inactive"; // bin_id: 39 is Inactive
            return "Active";
        }
        // Ward 9: bins 41-45 (4 Active, 1 Missing)
        else if (binId >= 41 && binId <= 45) {
            if (binId == 45) return "Missing"; // bin_id: 45 is Missing
            return "Active";
        }
        // Ward 10: bins 46-50 (all Active)
        else if (binId >= 46 && binId <= 50) {
            return "Active";
        }
        // Ward 11: bins 51-55 (4 Active, 1 Inactive)
        else if (binId >= 51 && binId <= 55) {
            if (binId == 54) return "Inactive"; // bin_id: 54 is Inactive
            return "Active";
        }
        // Ward 12: bins 56-60 (4 Active, 1 Missing)
        else if (binId >= 56 && binId <= 60) {
            if (binId == 60) return "Missing"; // bin_id: 60 is Missing
            return "Active";
        }
        // Ward 13: bins 61-65 (all Active)
        else if (binId >= 61 && binId <= 65) {
            return "Active";
        }
        // Ward 14: bins 66-70 (4 Active, 1 Inactive)
        else if (binId >= 66 && binId <= 70) {
            if (binId == 69) return "Inactive"; // bin_id: 69 is Inactive
            return "Active";
        }
        // Ward 15: bins 71-75 (4 Active, 1 Missing)
        else if (binId >= 71 && binId <= 75) {
            if (binId == 75) return "Missing"; // bin_id: 75 is Missing
            return "Active";
        }
        // Ward 16: bins 76-80 (all Active)
        else if (binId >= 76 && binId <= 80) {
            return "Active";
        }
        // Ward 17: bins 81-85 (4 Active, 1 Inactive)
        else if (binId >= 81 && binId <= 85) {
            if (binId == 84) return "Inactive"; // bin_id: 84 is Inactive
            return "Active";
        }
        // Ward 18: bins 86-90 (4 Active, 1 Missing)
        else if (binId >= 86 && binId <= 90) {
            if (binId == 90) return "Missing"; // bin_id: 90 is Missing
            return "Active";
        }
        // Ward 19: bins 91-95 (all Active)
        else if (binId >= 91 && binId <= 95) {
            return "Active";
        }
        
        // Default to Inactive for any bin IDs outside the expected range
        return "Inactive";
    }
    
    
    
    /**
     * Calculates planned ETA for a route stop based on ward order and stop order
     */
    private LocalDateTime calculatePlannedEta(Integer wardOrder, Integer stopOrder) {
        // Base time: 8:00 AM
        LocalDateTime baseTime = LocalDateTime.now().withHour(8).withMinute(0).withSecond(0).withNano(0);
        
        // Add time based on ward order (30 minutes per ward)
        baseTime = baseTime.plusMinutes((wardOrder - 1) * 30);
        
        // Add time based on stop order within ward (5 minutes per stop)
        baseTime = baseTime.plusMinutes((stopOrder - 1) * 5);
        
        return baseTime;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteWardResponse> getRouteWardsByRouteId(Integer routeId) {
        return routeWardRepository.findByRouteRouteIdOrderByWardOrder(routeId).stream()
                .map(RouteWardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RouteWardResponse> getRouteWardsByDate(LocalDate date) {
        return routeWardRepository.findByRouteCollectionDateOrderByRouteIdAndWardOrder(date).stream()
                .map(RouteWardResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteRouteWardsByRouteId(Integer routeId) {
        // First delete all route stops for this route
        routeStopRepository.deleteByRouteRouteId(routeId);
        
        // Then delete all route wards for this route
        routeWardRepository.deleteByRouteRouteId(routeId);
    }
    
    @Override
    public void deleteRouteWard(Integer routeWardId) {
        RouteWard routeWard = routeWardRepository.findById(routeWardId)
                .orElseThrow(() -> new RuntimeException("Route ward not found"));
        
        // Get the route ID before deletion
        Integer routeId = routeWard.getRoute().getRouteId();
        Integer wardNumber = routeWard.getWardNumber();
        
        // Delete all route stops for bins in this ward
        deleteRouteStopsForWard(routeId, wardNumber);
        
        // Delete the route ward
        routeWardRepository.deleteById(routeWardId);
    }
    
    /**
     * Deletes route stops for all bins in the specified ward
     */
    private void deleteRouteStopsForWard(Integer routeId, Integer wardNumber) {
        // Get all bin IDs for this ward
        List<String> binIds = getActiveBinIdsForWard(wardNumber);
        
        // Delete route stops for each bin in this ward
        for (String binId : binIds) {
            routeStopRepository.findByRouteRouteIdAndBinId(routeId, binId)
                    .ifPresent(routeStop -> routeStopRepository.deleteById(routeStop.getStopId()));
        }
    }
}
