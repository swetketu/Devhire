package com.devhire.application.dto;

import com.devhire.application.entity.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String company;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public ApplicationResponse(
            Long applicationId,
            Long jobId,
            String jobTitle,
            String company,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            ApplicationStatus status,
            LocalDateTime appliedAt) {

        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompany() {
        return company;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}