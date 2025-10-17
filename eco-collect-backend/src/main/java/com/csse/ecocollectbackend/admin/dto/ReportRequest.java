package com.csse.ecocollectbackend.admin.dto;

import java.util.Map;

public class ReportRequest {
    private String reportName;
    private String reportType;
    private Map<String, Object> parameters;

    // Constructors
    public ReportRequest() {}

    public ReportRequest(String reportName, String reportType) {
        this.reportName = reportName;
        this.reportType = reportType;
    }

    // Getters and Setters
    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public Map<String, Object> getParameters() { return parameters; }
    public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
}