package com.csse.ecocollectbackend.admin.service;

import com.csse.ecocollectbackend.admin.entity.Report;
import java.util.List;
import java.util.Map;

public interface ReportsService {
    List<Report> getAllReports();
    Report generateReport(String reportType, Map<String, Object> parameters);
    byte[] exportReportToCsv(Long reportId);
    Map<String, Object> getReportData(String reportType);
}