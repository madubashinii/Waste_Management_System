package com.csse.ecocollectbackend.login.service.impl;

import com.csse.ecocollectbackend.login.dto.SignInRequest;
import com.csse.ecocollectbackend.login.dto.SignUpRequest;
import com.csse.ecocollectbackend.login.dto.UserResponse;
import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;
import com.csse.ecocollectbackend.login.service.AuthService;
import com.csse.ecocollectbackend.common.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserResponse signUp(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        user.setRole(request.getRole());

        userRepository.save(user);

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public UserResponse signIn(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Plain-text password check
        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public UserResponse updateProfile(Integer userId, UserResponse updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        // user.setEmail(updatedUser.getEmail());
        // user.setPhone(updatedUser.getPhone());
        // user.setZone(updatedUser.getZone());

        userRepository.save(user);

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public List<UserResponse> getUsersByRole(Role role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(user -> new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole()))
                .collect(Collectors.toList());
    }
}