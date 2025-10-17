package com.csse.ecocollectbackend.resident.entity;

import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bins")
public class Bin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bin_id")
    private Integer binId;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    @ManyToOne(optional = false)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @Column
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "bin_type")
    private BinType binType;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BinStatus status = BinStatus.Active;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    public enum BinType { General, Recyclable, Organic }
    public enum BinStatus { Active, Inactive, Missing }

    // Getters and setters
    public Integer getBinId() { return binId; }
    public void setBinId(Integer binId) { this.binId = binId; }

    public User getResident() { return resident; }
    public void setResident(User resident) { this.resident = resident; }

    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BinType getBinType() { return binType; }
    public void setBinType(BinType binType) { this.binType = binType; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public BinStatus getStatus() { return status; }
    public void setStatus(BinStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

