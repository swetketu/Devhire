package com.devhire.resume.controller;

import com.devhire.ai.dto.ResumeAnalysisResponse;
import com.devhire.resume.entity.Resume;
import com.devhire.resume.service.ResumeAnalyzerService;
import com.devhire.resume.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumeAnalyzerService resumeAnalyzerService;

    public ResumeController(
            ResumeService resumeService,
            ResumeAnalyzerService resumeAnalyzerService) {

        this.resumeService = resumeService;
        this.resumeAnalyzerService = resumeAnalyzerService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {

        Resume resume =
                resumeService.uploadResume(
                        file,
                        authentication.getName()
                );

        return ResponseEntity.ok(resume);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Resume>> getMyResumes(
            Authentication authentication) {

        return ResponseEntity.ok(
                resumeService.getMyResumes(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{resumeId}/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @PathVariable Long resumeId,
            Authentication authentication)
            throws IOException {

        ResumeAnalysisResponse response =
                resumeAnalyzerService.analyzeResume(
                        resumeId,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<String> deleteResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        resumeService.deleteResume(
                resumeId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Resume deleted successfully"
        );
    }

    @GetMapping("/{resumeId}/download")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        Resume resume =
                resumeService.getResume(
                        resumeId,
                        authentication.getName()
                );

        Path path =
                Paths.get(resume.getFilePath());

        Resource resource;

        try {
            resource = new UrlResource(
                    path.toUri()
            );
        } catch (Exception e) {
            throw new RuntimeException(
                    "Could not load resume"
            );
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                resume.getFileName() +
                                "\""
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(resource);
    }

}