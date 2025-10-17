/*
// COMMENTED OUT - Collector functionality not in use currently
package com.csse.ecocollectbackend.collector.service.impl;


import com.csse.ecocollectbackend.collector.dto.CollectionUpdateRequest;
import com.csse.ecocollectbackend.collector.dto.CollectorNotificationDTO;
import com.csse.ecocollectbackend.collector.dto.CollectorRouteDTO;
import com.csse.ecocollectbackend.collector.dto.CollectorRouteStopDTO;
import com.csse.ecocollectbackend.collector.repository.CollectorBinCollectionRepository;
import com.csse.ecocollectbackend.collector.repository.CollectorNotificationRepository;
import com.csse.ecocollectbackend.collector.repository.CollectorRouteRepository;
import com.csse.ecocollectbackend.collector.service.CollectorService;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollectorServiceImpl implements CollectorService {

    @Autowired
    private CollectorRouteRepository collectorRouteRepository;
    @Autowired
    private CollectorBinCollectionRepository collectorBinCollectionRepository;

    @Autowired
    private CollectorNotificationRepository notificationRepository;


    @Override
    public List<CollectorRouteDTO> getTodaysRoutes(Integer collectorId) {
        LocalDate today = LocalDate.now();
        List<Route> routes = collectorRouteRepository.findTodaysRoutesByCollector(collectorId, today);

        return routes.stream().map(r -> {
            List<CollectorRouteStopDTO> stops = r.getRouteStops().stream().map(rs -> new CollectorRouteStopDTO(
                    rs.getStopId(),
                    rs.getBin().getBinId(),
                    rs.getStopOrder(),
                    rs.getCollected(),
                    null
            )).collect(Collectors.toList());

            return new CollectorRouteDTO(
                    r.getRouteId(),
                    r.getRouteName(),
                    r.getZone().getZoneName(),
                    r.getStatus().toString(),
                    r.getCollectionDate().toString(),
                    stops
            );
        }).collect(Collectors.toList());
    }

    @Override
    public void markBinCollected(CollectionUpdateRequest request) {
        Optional<Bin> optionalBin = collectorBinCollectionRepository.findById(request.getBinId());

        if (optionalBin.isPresent()) {
            Bin bin = optionalBin.get();
            bin.setWeightKg(request.getWeightKg());      // save weight
            bin.setPhotoUrl(request.getPhotoUrl());      // save photo URL
            bin.setRemarks(request.getRemarks());
            bin.setCollectedAt(LocalDateTime.now());
            bin.setStatus(Bin.CollectionStatus.valueOf(request.getStatus().toUpperCase()));

            collectorBinCollectionRepository.save(bin);
        } else {
            // Optional: create new bin if it doesn't exist
            Bin collection = new Bin();
            collection.setBinId(request.getBinId());
            collection.setWeightKg(request.getWeightKg());
            collection.setPhotoUrl(request.getPhotoUrl());
            collection.setRemarks(request.getRemarks());
            collection.setCollectedAt(LocalDateTime.now());
            collection.setStatus(Bin.CollectionStatus.valueOf(request.getStatus().toUpperCase()));

            Route route = new Route();
            route.setRouteId(request.getRouteId());
            collection.setRoute(route);

            User collector = new User();
            collector.setUserId(request.getCollectorId());
            collection.setCollector(collector);

            collectorBinCollectionRepository.save(collection);
        }
    }

    @Override
    public void reportIssue(CollectionUpdateRequest request) {
        // Find existing bin collection if already created
        Optional<Bin> optional = collectorBinCollectionRepository
                .findByRoute_RouteId(request.getRouteId())
                .stream()
                .filter(bc -> bc.getBinId().equals(request.getBinId()))
                .findFirst();

        Bin collection;
        if (optional.isPresent()) {
            collection = optional.get();
        } else {
            // If no previous record, create new
            collection = new Bin();
            collection.setBinId(request.getBinId());

            Route route = new Route();
            route.setRouteId(request.getRouteId());
            collection.setRoute(route);

            User collector = new User();
            collector.setUserId(request.getCollectorId());
            collection.setCollector(collector);
        }

        collection.setStatus(Bin.CollectionStatus.valueOf(request.getStatus().toUpperCase()));
        collection.setRemarks(request.getRemarks());
        collection.setCollectedAt(LocalDateTime.now());

        collectorBinCollectionRepository.save(collection);
    }

    @Override
    public List<CollectorNotificationDTO> getNotifications(Integer collectorId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(collectorId);

        return notifications.stream()
                .map(n -> new CollectorNotificationDTO(
                        n.getNotificationId(),
                        n.getType().name().replace("_", " "),
                        n.getMessage(),
                        n.isReadStatus(),
                        n.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public boolean markNotificationAsRead(Integer notificationId) {
        return notificationRepository.findById(notificationId).map(notification -> {
            notification.setReadStatus(true);
            notificationRepository.save(notification);
            return true;
        }).orElse(false);
    }
}
*/