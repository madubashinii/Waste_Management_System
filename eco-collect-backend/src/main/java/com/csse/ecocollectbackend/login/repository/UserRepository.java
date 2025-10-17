package com.csse.ecocollectbackend.login.repository;

import com.csse.ecocollectbackend.login.entity.User;
import com.csse.ecocollectbackend.common.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
