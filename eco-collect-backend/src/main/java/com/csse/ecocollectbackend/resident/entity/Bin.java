package com.csse.ecocollectbackend.resident.entity;

import com.csse.ecocollectbackend.dispatcher.routes.entity.Route;
import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "bins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bin {

    @Id
    @Column(name = "bin_id", nullable = false)
    private String binId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id", nullable = false)
    private User collector;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "photo_url")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private CollectionStatus status = CollectionStatus.PENDING;

    @Column(name = "remarks")
    private String remarks;

    public enum CollectionStatus {
        PENDING,
        COLLECTED,
        MISSED,
        OVERFLOW
    }
}