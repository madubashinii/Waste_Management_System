package com.csse.ecocollectbackend.admin.service.impl;

import com.csse.ecocollectbackend.admin.entity.Report;
import com.csse.ecocollectbackend.admin.repository.ReportRepository;
import com.csse.ecocollectbackend.admin.service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReportsServiceImpl implements ReportsService {

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public Report generateReport(String reportType, Map<String, Object> parameters) {
        // In a real application, this would generate actual report data
        String dataJson = generateSampleReportData(reportType);

        Report report = new Report();
        report.setReportName("Generated " + reportType + " Report");
        report.setReportType(Report.ReportType.valueOf(reportType.toUpperCase()));
        report.setDataJson(dataJson);

        return reportRepository.save(report);
    }

    @Override
    public byte[] exportReportToCsv(Long reportId) {
        // Simplified CSV export - in real app, this would generate actual CSV
        return "Report Data in CSV Format".getBytes();
    }

    @Override
    public Map<String, Object> getReportData(String reportType) {
        return generateSampleDataForFrontend(reportType);
    }

    private String generateSampleReportData(String reportType) {
        // Generate sample JSON data based on report type
        Map<String, Object> data = generateSampleDataForFrontend(reportType);
        return mapToJsonString(data);
    }

    private Map<String, Object> generateSampleDataForFrontend(String reportType) {
        Map<String, Object> data = new HashMap<>();

        switch (reportType.toLowerCase()) {
            case "waste-by-zone":
                data.put("columns", Arrays.asList("zone", "waste", "recycled"));
                data.put("data", Arrays.asList(
                        Map.of("zone", "North Zone", "waste", 1500, "recycled", 900),
                        Map.of("zone", "South Zone", "waste", 1200, "recycled", 800),
                        Map.of("zone", "East Zone", "waste", 1800, "recycled", 1200)
                ));
                break;

            case "recycling-rate":
                data.put("columns", Arrays.asList("zone", "rate"));
                data.put("data", Arrays.asList(
                        Map.of("zone", "North Zone", "rate", "60%"),
                        Map.of("zone", "South Zone", "rate", "67%"),
                        Map.of("zone", "East Zone", "rate", "67%")
                ));
                break;

            case "missed-pickups":
                data.put("columns", Arrays.asList("zone", "missed"));
                data.put("data", Arrays.asList(
                        Map.of("zone", "North Zone", "missed", 3),
                        Map.of("zone", "South Zone", "missed", 1),
                        Map.of("zone", "East Zone", "missed", 2)
                ));
                break;

            default:
                data.put("columns", Arrays.asList("metric", "value"));
                data.put("data", Arrays.asList(
                        Map.of("metric", "Total Waste", "value", 4500),
                        Map.of("metric", "Recycled", "value", 2900),
                        Map.of("metric", "Recycling Rate", "value", "64%")
                ));
        }

        return data;
    }

    private String mapToJsonString(Map<String, Object> data) {
        // Simplified JSON conversion - in real app use Jackson ObjectMapper
        return data.toString();
    }
}
