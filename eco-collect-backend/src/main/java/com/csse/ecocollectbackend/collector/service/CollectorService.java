/*
// COMMENTED OUT - Collector functionality not in use currently
package com.csse.ecocollectbackend.collector.service;

import com.csse.ecocollectbackend.collector.dto.CollectionUpdateRequest;
import com.csse.ecocollectbackend.collector.dto.CollectorNotificationDTO;
import com.csse.ecocollectbackend.collector.dto.CollectorRouteDTO;

import java.util.List;

public interface CollectorService {
    List<CollectorRouteDTO> getTodaysRoutes(Integer collectorId);

    void markBinCollected(CollectionUpdateRequest request);

    void reportIssue(CollectionUpdateRequest request);

    List<CollectorNotificationDTO> getNotifications(Integer collectorId);

    boolean markNotificationAsRead(Integer notificationId);
}
*/