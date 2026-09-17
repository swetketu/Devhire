package com.devhire.dashboard.service;

import com.devhire.dashboard.dto.RecruiterDashboardResponse;
import com.devhire.job.repository.JobRepository;
import com.devhire.application.entity.ApplicationStatus;
import com.devhire.application.repository.JobApplicationRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class RecruiterDashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    public RecruiterDashboardService(
            UserRepository userRepository,
            JobRepository jobRepository,
            JobApplicationRepository applicationRepository) {

        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Cacheable(
            value = "recruiterDashboard",
            key = "#email"
    )
    public RecruiterDashboardResponse getDashboard(String email) {

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
                jobRepository.countByRecruiterId(recruiterId);

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