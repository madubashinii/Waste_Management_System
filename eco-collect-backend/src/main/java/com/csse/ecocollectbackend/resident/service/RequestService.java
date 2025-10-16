package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.RequestDTO;
import com.csse.ecocollectbackend.resident.dto.RequestDetailsDTO;

import java.util.List;

public interface RequestService {
    List<RequestDTO> getAllRequestsByUser(Integer userId);

    List<RequestDTO> getPaidRequestsByUserId(Integer userId);

    RequestDetailsDTO getRequestDetails(Integer requestId, Integer userId);
}
