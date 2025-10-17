package com.csse.ecocollectbackend.login.controller;

import com.csse.ecocollectbackend.login.dto.SignInRequest;
import com.csse.ecocollectbackend.login.dto.SignUpRequest;
import com.csse.ecocollectbackend.login.dto.UserResponse;
import com.csse.ecocollectbackend.login.service.AuthService;
import com.csse.ecocollectbackend.common.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public UserResponse signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("/signin")
    public UserResponse signIn(@RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

    @GetMapping("/users/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable Role role) {
        return authService.getUsersByRole(role);
    }
}