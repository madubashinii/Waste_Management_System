package com.csse.ecocollectbackend.login.dto;

import com.csse.ecocollectbackend.common.model.Role;

public class UserResponse {
    private Integer userId;
    private String name;
    private String email;
    private Role role;

    public UserResponse(Integer userId, String name, String email, Role role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
