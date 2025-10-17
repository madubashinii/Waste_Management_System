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

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    @ManyToOne(optional = false)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id", nullable = false)
    private User collector;

    @Column
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "bin_type")
    private BinType binType;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BinStatus status = BinStatus.Active;

    public enum BinType { General, Recyclable, Organic }
    public enum BinStatus { Active, Inactive, Missing }

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "photo_url")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private CollectionStatus colstatus = CollectionStatus.PENDING;

    @Column(name = "remarks")
    private String remarks;

    public enum CollectionStatus {
        PENDING,
        COLLECTED,
        MISSED,
        OVERFLOW
    }
}