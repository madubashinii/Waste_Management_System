package com.csse.ecocollectbackend.login.controller;

import com.csse.ecocollectbackend.login.dto.SignInRequest;
import com.csse.ecocollectbackend.login.dto.SignUpRequest;
import com.csse.ecocollectbackend.login.dto.UserResponse;
import com.csse.ecocollectbackend.login.service.AuthService;
import jakarta.servlet.http.HttpSession;
import com.csse.ecocollectbackend.login.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    @GetMapping("/profile")
    public UserResponse getProfile(HttpSession session) {
        UserResponse user = (UserResponse) session.getAttribute("loggedUser");
        if (user == null) {
            throw new RuntimeException("User not logged in");
        }
        return user;
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully";
    }
}