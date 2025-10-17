/*
// COMMENTED OUT - Collector functionality not in use currently
package com.csse.ecocollectbackend.collector.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectorNotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
*/