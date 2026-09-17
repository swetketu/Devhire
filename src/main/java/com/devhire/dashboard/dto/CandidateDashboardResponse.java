package com.devhire.dashboard.dto;

public class CandidateDashboardResponse {

    private long totalApplications;
    private long applied;
    private long underReview;
    private long shortlisted;
    private long interviews;
    private long offers;
    private long rejected;
    private long savedJobs;
    private long resumes;

    public CandidateDashboardResponse(
            long totalApplications,
            long applied,
            long underReview,
            long shortlisted,
            long interviews,
            long offers,
            long rejected,
            long savedJobs,
            long resumes) {

        this.totalApplications = totalApplications;
        this.applied = applied;
        this.underReview = underReview;
        this.shortlisted = shortlisted;
        this.interviews = interviews;
        this.offers = offers;
        this.rejected = rejected;
        this.savedJobs = savedJobs;
        this.resumes = resumes;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getApplied() {
        return applied;
    }

    public long getUnderReview() {
        return underReview;
    }

    public long getShortlisted() {
        return shortlisted;
    }

    public long getInterviews() {
        return interviews;
    }

    public long getOffers() {
        return offers;
    }

    public long getRejected() {
        return rejected;
    }

    public long getSavedJobs() {
        return savedJobs;
    }

    public long getResumes() {
        return resumes;
    }
}