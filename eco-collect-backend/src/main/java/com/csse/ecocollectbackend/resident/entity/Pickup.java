package com.csse.ecocollectbackend.resident.entity;

import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickups")
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pickupId;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    @ManyToOne
    @JoinColumn(name = "bin_id")
    private Bin bin;

    @Column(name = "pickup_type")
    @Enumerated(EnumType.STRING)
    private PickupType pickupType = PickupType.Regular;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PickupStatus status = PickupStatus.Pending;

    @Column(name = "created_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    public enum PickupType { Regular, Bulky, Emergency }
    public enum PickupStatus { Pending, Completed, Cancelled }

    // Getters and setters
    public Integer getPickupId() { return pickupId; }
    public void setPickupId(Integer pickupId) { this.pickupId = pickupId; }

    public User getResident() { return resident; }
    public void setResident(User resident) { this.resident = resident; }

    public Bin getBin() { return bin; }
    public void setBin(Bin bin) { this.bin = bin; }

    public PickupType getPickupType() { return pickupType; }
    public void setPickupType(PickupType pickupType) { this.pickupType = pickupType; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

