package com.csse.ecocollectbackend.admin.repository;

import com.csse.ecocollectbackend.admin.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportType(Report.ReportType reportType);
    List<Report> findByReportNameContainingIgnoreCase(String reportName);
}