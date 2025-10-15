package com.csse.ecocollectbackend.dispatcher.service;

import com.csse.ecocollectbackend.dispatcher.dto.CreateZoneRequest;
import com.csse.ecocollectbackend.dispatcher.dto.ZoneResponse;
import java.util.List;

public interface ZoneService {
    List<ZoneResponse> createZone(CreateZoneRequest request);
    List<ZoneResponse> getAllZones();
    List<String> getAllZoneNames();
    List<ZoneResponse> getWardsByZoneName(String zoneName);
    ZoneResponse getWardByZoneNameAndWardNumber(String zoneName, Integer wardNumber);
    boolean zoneExists(String zoneName);
    boolean wardExists(String zoneName, Integer wardNumber);
    long countWardsByZoneName(String zoneName);
}