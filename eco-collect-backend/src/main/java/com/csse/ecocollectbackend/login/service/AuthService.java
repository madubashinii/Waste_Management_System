package com.csse.ecocollectbackend.login.service;

import com.csse.ecocollectbackend.login.dto.SignInRequest;
import com.csse.ecocollectbackend.login.dto.SignUpRequest;
import com.csse.ecocollectbackend.login.dto.UserResponse;
import com.csse.ecocollectbackend.common.model.Role;

import java.util.List;

public interface AuthService {
    UserResponse signUp(SignUpRequest request);
    UserResponse signIn(SignInRequest request);
    List<UserResponse> getUsersByRole(Role role);
}
