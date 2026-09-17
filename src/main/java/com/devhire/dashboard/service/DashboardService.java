package com.devhire.dashboard.service;

import com.devhire.application.entity.ApplicationStatus;
import com.devhire.application.repository.JobApplicationRepository;
import com.devhire.dashboard.dto.CandidateDashboardResponse;
import com.devhire.dashboard.dto.RecruiterDashboardResponse;
import com.devhire.job.repository.JobRepository;
import com.devhire.resume.repository.ResumeRepository;
import com.devhire.savedjob.repository.SavedJobRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;

    public DashboardService(
            UserRepository userRepository,
            JobApplicationRepository applicationRepository,
            SavedJobRepository savedJobRepository,
            ResumeRepository resumeRepository,
            JobRepository jobRepository) {

        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
    }

    // =========================
    // CANDIDATE DASHBOARD
    // =========================

    @Cacheable(
            value = "candidateDashboard",
            key = "#email"
    )
    public CandidateDashboardResponse getCandidateDashboard(
            String email) {

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidate not found"
                        )
                );

        if (!candidate.getRole().equals("CANDIDATE")) {
            throw new RuntimeException(
                    "Only candidates can access this dashboard"
            );
        }

        Long candidateId = candidate.getId();

        long totalApplications =
                applicationRepository
                        .countByCandidateId(candidateId);

        long applied =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.APPLIED
                        );

        long underReview =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.UNDER_REVIEW
                        );

        long shortlisted =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.SHORTLISTED
                        );

        long interviews =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.INTERVIEW
                        );

        long offers =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.OFFER
                        );

        long rejected =
                applicationRepository
                        .countByCandidateIdAndStatus(
                                candidateId,
                                ApplicationStatus.REJECTED
                        );

        long savedJobs =
                savedJobRepository
                        .countByUserId(candidateId);

        long resumes =
                resumeRepository
                        .countByUserId(candidateId);

        return new CandidateDashboardResponse(
                totalApplications,
                applied,
                underReview,
                shortlisted,
                interviews,
                offers,
                rejected,
                savedJobs,
                resumes
        );
    }


    // =========================
    // RECRUITER DASHBOARD
    // =========================

    @Cacheable(
            value = "recruiterDashboard",
            key = "#email"
    )
    public RecruiterDashboardResponse getRecruiterDashboard(
            String email) {

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Recruiter not found"
                        )
                );

        if (!recruiter.getRole().equals("RECRUITER")) {
            throw new RuntimeException(
                    "Only recruiters can access this dashboard"
            );
        }

        Long recruiterId = recruiter.getId();

        long totalJobs =
                jobRepository
                        .countByRecruiterId(recruiterId);

        long totalApplications =
                applicationRepository
                        .countByJobRecruiterId(recruiterId);

        long shortlisted =
                applicationRepository
                        .countByJobRecruiterIdAndStatus(
                                recruiterId,
                                ApplicationStatus.SHORTLISTED
                        );

        long interviews =
                applicationRepository
                        .countByJobRecruiterIdAndStatus(
                                recruiterId,
                                ApplicationStatus.INTERVIEW
                        );

        long offers =
                applicationRepository
                        .countByJobRecruiterIdAndStatus(
                                recruiterId,
                                ApplicationStatus.OFFER
                        );

        return new RecruiterDashboardResponse(
                totalJobs,
                totalApplications,
                shortlisted,
                interviews,
                offers
        );
    }
}