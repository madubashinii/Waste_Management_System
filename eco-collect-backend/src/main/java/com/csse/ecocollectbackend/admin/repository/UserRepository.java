package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAll();
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.UserRole role);
}
