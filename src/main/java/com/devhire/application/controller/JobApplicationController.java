package com.devhire.application.controller;

import com.devhire.application.entity.ApplicationStatus;
import com.devhire.application.entity.JobApplication;
import com.devhire.application.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(
            JobApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    @PostMapping("/jobs/{jobId}")
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        JobApplication application =
                applicationService.applyForJob(
                        jobId,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(application);
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            Authentication authentication) {

        List<JobApplication> applications =
                applicationService.getMyApplications(
                        authentication.getName()
                );

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getApplicationsForJob(
                        jobId,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.updateStatus(
                        applicationId,
                        status,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<JobApplication> getApplicationById(
            @PathVariable Long applicationId,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(
                        applicationId,
                        authentication.getName()
                )
        );
    }
}