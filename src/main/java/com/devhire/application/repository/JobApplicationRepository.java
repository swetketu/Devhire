package com.devhire.application.repository;

import com.devhire.application.entity.ApplicationStatus;
import com.devhire.application.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    Optional<JobApplication> findByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );

    List<JobApplication> findByCandidateId(Long candidateId);

    List<JobApplication> findByJobId(Long jobId);

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(
            Long candidateId,
            ApplicationStatus status);

    long countByJobRecruiterId(Long recruiterId);

    long countByJobRecruiterIdAndStatus(
            Long recruiterId,
            ApplicationStatus status);
}