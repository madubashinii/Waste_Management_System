package com.csse.ecocollectbackend.login.service;

import com.csse.ecocollectbackend.login.dto.SignInRequest;
import com.csse.ecocollectbackend.login.dto.SignUpRequest;
import com.csse.ecocollectbackend.login.dto.UserResponse;

public interface AuthService {
    UserResponse signUp(SignUpRequest request);
    UserResponse signIn(SignInRequest request);
}
