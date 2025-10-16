package com.csse.ecocollectbackend.resident.service;

import com.csse.ecocollectbackend.resident.dto.RequestDTO;
import com.csse.ecocollectbackend.resident.dto.RequestDetailsDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestServiceImpl implements RequestService {

    @Override
    public List<RequestDTO> getAllRequestsByUser(Integer userId) {
        // TODO: implement fetching from repository
        return List.of(); // temporary stub
    }

    @Override
    public List<RequestDTO> getPaidRequestsByUserId(Integer userId) {
        // TODO: implement fetching paid requests
        return List.of();
    }

    @Override
    public RequestDetailsDTO getRequestDetails(Integer requestId, Integer userId) {
        // TODO: implement fetching details
        return null;
    }
}

