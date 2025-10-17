package com.csse.ecocollectbackend.collector.entity;

import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "route_stops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stopId;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "bin_id")
    private Bin bin;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    private Integer stopOrder;
    private Boolean collected = false;
    private String photoUrl;
    private LocalDateTime plannedEta;
    private LocalDateTime arrivedAt;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "reassigned_to_driver_id")
    private User reassignedToDriver;

    @Enumerated(EnumType.STRING)
    private ReasonCode reasonCode = ReasonCode.NONE;

    @Enumerated(EnumType.STRING)
    private Source source = Source.MANUAL;

    private Double weightKg = 0.0;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {PENDING, IN_PROGRESS, DONE, MISSED, SKIPPED}

    public enum ReasonCode {NONE, BLOCKED, NO_BIN_OUT, SAFETY, OTHER}

    public enum Source {QR, MANUAL}
}
