package com.devhire.savedjob.controller;

import com.devhire.savedjob.entity.SavedJob;
import com.devhire.savedjob.service.SavedJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(
            SavedJobService savedJobService) {

        this.savedJobService = savedJobService;
    }

    @PostMapping("/{jobId}/save")
    public ResponseEntity<String> saveJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        return ResponseEntity.ok(
                savedJobService.saveJob(
                        jobId,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{jobId}/save")
    public ResponseEntity<String> unsaveJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        return ResponseEntity.ok(
                savedJobService.unsaveJob(
                        jobId,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/saved")
    public ResponseEntity<List<SavedJob>> getSavedJobs(
            Authentication authentication) {

        return ResponseEntity.ok(
                savedJobService.getSavedJobs(
                        authentication.getName()
                )
        );
    }
}