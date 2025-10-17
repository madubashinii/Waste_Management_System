package com.csse.ecocollectbackend.resident.entity;

import com.csse.ecocollectbackend.login.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "resident_waste_log")
public class WasteLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    @ManyToOne
    @JoinColumn(name = "waste_type_id")
    private WasteType wasteType;

    private BigDecimal quantity;
    private LocalDateTime createdAt;
}

