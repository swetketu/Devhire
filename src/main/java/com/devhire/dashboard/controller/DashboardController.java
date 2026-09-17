package com.devhire.dashboard.controller;

import com.devhire.dashboard.dto.CandidateDashboardResponse;
import com.devhire.dashboard.dto.RecruiterDashboardResponse;
import com.devhire.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/candidate")
    public ResponseEntity<CandidateDashboardResponse>
    getCandidateDashboard(Authentication authentication) {

        return ResponseEntity.ok(
                dashboardService.getCandidateDashboard(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/recruiter")
    public ResponseEntity<RecruiterDashboardResponse>
    getRecruiterDashboard(Authentication authentication) {

        return ResponseEntity.ok(
                dashboardService.getRecruiterDashboard(
                        authentication.getName()
                )
        );
    }
}