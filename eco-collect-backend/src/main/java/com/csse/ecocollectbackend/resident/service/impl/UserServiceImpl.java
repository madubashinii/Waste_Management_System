package com.csse.ecocollectbackend.resident.service.impl;

import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.login.repository.UserRepository;

import com.csse.ecocollectbackend.resident.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
