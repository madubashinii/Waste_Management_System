package com.csse.ecocollectbackend.dispatcher.zones.service;

import com.csse.ecocollectbackend.dispatcher.zones.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.zones.dto.ZoneResponse;
import java.util.List;

public interface ZoneService {
    ZoneResponse createZone(CreateZoneRequest request);
    List<ZoneResponse> getAllZones();
    ZoneResponse getZoneByName(String zoneName);
    boolean zoneExists(String zoneName);
}