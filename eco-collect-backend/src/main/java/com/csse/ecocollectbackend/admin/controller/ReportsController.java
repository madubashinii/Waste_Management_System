package com.csse.ecocollectbackend.admin.controller;

import com.csse.ecocollectbackend.admin.service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    // Get report data for preview
    @GetMapping("/data")
    public Map<String, Object> getReportData(@RequestParam String reportType) {
        return reportsService.getReportData(reportType);
    }

    // Export report as CSV
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(@RequestParam String reportType) {
        // For demo, we'll generate a simple CSV
        String csvContent = generateSampleCsv(reportType);
        byte[] csvBytes = csvContent.getBytes();

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=\"" + reportType + "-report.csv\"")
                .body(csvBytes);
    }

    private String generateSampleCsv(String reportType) {
        switch (reportType) {
            case "waste-by-zone":
                return "Zone,Waste (kg),Recycled (kg)\n" +
                        "North Zone,1500,900\n" +
                        "South Zone,1200,800\n" +
                        "East Zone,1800,1200\n";

            case "recycling-rate":
                return "Zone,Recycling Rate\n" +
                        "North Zone,60%\n" +
                        "South Zone,67%\n" +
                        "East Zone,67%\n";

            case "missed-pickups":
                return "Zone,Missed Pickups\n" +
                        "North Zone,3\n" +
                        "South Zone,1\n" +
                        "East Zone,2\n";

            case "invoiced-vs-paid":
                return "Month,Invoiced ($),Paid ($)\n" +
                        "January,15000,12000\n" +
                        "February,16000,14000\n" +
                        "March,17000,15000\n";

            default:
                return "Metric,Value\nTotal Waste,4500\nRecycled,2900\nRecycling Rate,64%\n";
        }
    }
}
