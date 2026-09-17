package com.devhire.savedjob.entity;

import com.devhire.job.entity.Job;
import com.devhire.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "saved_jobs",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "job_id"}
                )
        }
)
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    public SavedJob() {
        this.savedAt = LocalDateTime.now();
    }

    public SavedJob(User user, Job job) {
        this.user = user;
        this.job = job;
        this.savedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Job getJob() {
        return job;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }
}