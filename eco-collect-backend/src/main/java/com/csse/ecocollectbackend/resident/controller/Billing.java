package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.dto.RequestDTO;
import com.csse.ecocollectbackend.resident.dto.RequestDetailsDTO;
import com.csse.ecocollectbackend.resident.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.List;

@RestController
@RequestMapping("/api/Billing")
public class Billing {

    private final RequestService requestService;

    public Billing(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/requests/paid")
    public ResponseEntity<?> getPaidRequests(@SessionAttribute("userId") Integer userId) {
        if (userId == null) return ResponseEntity.status(401).build();

        List<RequestDTO> requests = requestService.getPaidRequestsByUserId(userId);

        //  RequestDTO: { id, date, invoiceId, totalAmount }
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/requests/{requestId}")
    public ResponseEntity<?> getRequestDetails(@PathVariable Integer requestId,
                                               @SessionAttribute("userId") Integer userId) {
        // Validate ownership
        RequestDetailsDTO details = requestService.getRequestDetails(requestId, userId);
        return ResponseEntity.ok(details);
    }
}

