package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.service.RequestService;
import com.csse.ecocollectbackend.resident.dto.RequestDTO;
import com.csse.ecocollectbackend.resident.dto.RequestDetailsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<?> getUserRequests(@SessionAttribute("userId") Integer userId) {
        if (userId == null) return ResponseEntity.status(401).build();
        List<RequestDTO> requests = requestService.getAllRequestsByUser(userId);
        return ResponseEntity.ok(requests);
    }
}