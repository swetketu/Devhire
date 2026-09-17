package com.devhire.application.service;

import com.devhire.application.entity.ApplicationStatus;
import com.devhire.application.entity.JobApplication;
import com.devhire.application.repository.JobApplicationRepository;
import com.devhire.dashboard.service.DashboardCacheService;
import com.devhire.job.entity.Job;
import com.devhire.job.repository.JobRepository;
import com.devhire.notification.kafka.KafkaProducer;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final KafkaProducer kafkaProducer;
    private final DashboardCacheService dashboardCacheService;

    public JobApplicationService(
            JobApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            KafkaProducer kafkaProducer,
            DashboardCacheService dashboardCacheService) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.kafkaProducer = kafkaProducer;
        this.dashboardCacheService = dashboardCacheService;
    }

    // =========================
    // CHECK JOB OWNERSHIP
    // =========================

    private void checkOwnership(
            Job job,
            String recruiterEmail) {

        if (job.getRecruiter() == null) {
            throw new RuntimeException(
                    "This job has no recruiter assigned"
            );
        }

        if (!job.getRecruiter()
                .getEmail()
                .equals(recruiterEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this job"
            );
        }
    }


    // =========================
    // APPLY FOR JOB
    // =========================

    @CacheEvict(
            value = "candidateDashboard",
            key = "#email"
    )
    public JobApplication applyForJob(
            Long jobId,
            String email) {

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        if (!candidate.getRole().equals("CANDIDATE")) {
            throw new RuntimeException(
                    "Only candidates can apply for jobs"
            );
        }

        if (applicationRepository
                .existsByJobIdAndCandidateId(
                        jobId,
                        candidate.getId())) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        JobApplication application =
                new JobApplication(job, candidate);

        return applicationRepository.save(application);
    }


    // =========================
    // GET MY APPLICATIONS
    // =========================

    public List<JobApplication> getMyApplications(
            String email) {

        User candidate = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return applicationRepository
                .findByCandidateId(candidate.getId());
    }


    // =========================
    // GET APPLICATIONS FOR JOB
    // =========================

    public List<JobApplication> getApplicationsForJob(
            Long jobId,
            String recruiterEmail) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        checkOwnership(job, recruiterEmail);

        return applicationRepository
                .findByJobId(jobId);
    }


    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    public JobApplication updateStatus(
            Long applicationId,
            ApplicationStatus status,
            String recruiterEmail) {

        JobApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        // Check that recruiter owns the job
        checkOwnership(
                application.getJob(),
                recruiterEmail
        );

        if (application.getStatus() == status) {
            throw new RuntimeException(
                    "Application is already in "
                            + status
                            + " status"
            );
        }

        // Get emails before updating
        String candidateEmail =
                application
                        .getCandidate()
                        .getEmail();

        String recruiterEmailFromJob =
                application
                        .getJob()
                        .getRecruiter()
                        .getEmail();

        // Update status
        application.setStatus(status);

        applicationRepository.save(application);

        // =========================
        // EVICT DASHBOARD CACHES
        // =========================

        dashboardCacheService
                .evictCandidateDashboard(
                        candidateEmail
                );

        dashboardCacheService
                .evictRecruiterDashboard(
                        recruiterEmailFromJob
                );

        // =========================
        // SEND KAFKA NOTIFICATION
        // =========================

        kafkaProducer.sendStatusUpdate(
                application.getCandidate().getId()
                        + "|"
                        + "Your application for "
                        + application.getJob().getTitle()
                        + " has been updated to "
                        + status
        );

        return application;
    }


    // =========================
    // GET APPLICATION BY ID
    // =========================

    public JobApplication getApplicationById(
            Long applicationId,
            String email) {

        JobApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        boolean isCandidate =
                application
                        .getCandidate()
                        .getEmail()
                        .equals(email);

        boolean isRecruiter =
                application.getJob().getRecruiter() != null
                        &&
                        application
                                .getJob()
                                .getRecruiter()
                                .getEmail()
                                .equals(email);

        if (!isCandidate && !isRecruiter) {
            throw new RuntimeException(
                    "You are not authorized to access this application"
            );
        }

        return application;
    }
}