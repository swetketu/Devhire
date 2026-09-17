package com.devhire.job.controller;

import com.devhire.job.entity.Job;
import com.devhire.job.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create job
    @PostMapping
    public ResponseEntity<Job> createJob(
            @RequestBody Job job,
            Authentication authentication) {

        Job createdJob = jobService.createJob(
                job,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdJob);
    }

    // Get all jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }

    // Update job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody Job job,
            Authentication authentication) {

        return ResponseEntity.ok(
                jobService.updateJob(
                        id,
                        job,
                        authentication.getName()
                )
        );
    }

    // Delete job
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        jobService.deleteJob(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }

    // Search jobs by title
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(

            @RequestParam(required = false) String title,

            @RequestParam(required = false) String location,

            @RequestParam(required = false) String employmentType,

            @RequestParam(required = false) Long salary) {

        return ResponseEntity.ok(
                jobService.searchJobs(
                        title,
                        location,
                        employmentType,
                        salary
                )
        );
    }

    // Search jobs by location
    @GetMapping("/location")
    public ResponseEntity<List<Job>> searchByLocation(
            @RequestParam String location) {

        return ResponseEntity.ok(
                jobService.searchByLocation(location)
        );
    }

    // Filter by employment type
    @GetMapping("/employment-type")
    public ResponseEntity<List<Job>> filterByEmploymentType(
            @RequestParam String type) {

        return ResponseEntity.ok(
                jobService.filterByEmploymentType(type)
        );
    }

    // Filter by minimum salary
    @GetMapping("/minimum-salary")
    public ResponseEntity<List<Job>> filterByMinimumSalary(
            @RequestParam Long salary) {

        return ResponseEntity.ok(
                jobService.filterByMinimumSalary(salary)
        );
    }

    // Get recruiter's jobs
    @GetMapping("/my")
    public ResponseEntity<List<Job>> getMyJobs(
            Authentication authentication) {

        return ResponseEntity.ok(
                jobService.getMyJobs(
                        authentication.getName()
                )
        );
    }
}