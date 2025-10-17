package com.csse.ecocollectbackend.admin.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String reportName;

    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    @Column(columnDefinition = "JSON")
    private String dataJson;

    private LocalDateTime createdAt;

    public enum ReportType {
        WASTE_BY_ZONE, RECYCLING_RATE, MISSED_PICKUPS, INVOICED_VS_PAID, FINANCIAL, OPERATIONAL
    }

    // Constructors
    public Report() {}

    public Report(String reportName, ReportType reportType, String dataJson) {
        this.reportName = reportName;
        this.reportType = reportType;
        this.dataJson = dataJson;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public ReportType getReportType() { return reportType; }
    public void setReportType(ReportType reportType) { this.reportType = reportType; }

    public String getDataJson() { return dataJson; }
    public void setDataJson(String dataJson) { this.dataJson = dataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}