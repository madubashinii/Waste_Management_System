package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.resident.dto.BinSummary;
import com.csse.ecocollectbackend.resident.service.BinService;
import com.csse.ecocollectbackend.resident.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
public class DashboardController {

    private final UserService userService; // service to fetch user info
    private final BinService binService;   // service to fetch bin summary

    public DashboardController(UserService userService, BinService binService) {
        this.userService = userService;
        this.binService = binService;
    }

    @GetMapping("/api/client_dashboard")
    public ResponseEntity<?> getDashboardData(
            @SessionAttribute(name = "userId", required = false) Integer userId) {

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        // fetch user info
        User user = userService.getUserById(userId);

        // fetch bin summary
        BinSummary summary = binService.getSummaryByUserId(userId);

        return ResponseEntity.ok(
                Map.of(
                        "userName", user.getName(),
                        "binSummary", Map.of(
                                "plasticCount", summary.getPlasticCount(),
                                "organicCount", summary.getOrganicCount(),
                                "generalCount", summary.getGeneralCount()
                        )
                )
        );
    }
}

