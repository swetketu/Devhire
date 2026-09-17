package com.devhire.application.entity;

import com.devhire.job.entity.Job;
import com.devhire.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(nullable = false)
    private LocalDateTime appliedAt;

    public JobApplication() {
    }

    public JobApplication(Job job, User candidate) {
        this.job = job;
        this.candidate = candidate;
        this.status = ApplicationStatus.APPLIED;
        this.appliedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Job getJob() {
        return job;
    }

    public User getCandidate() {
        return candidate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}