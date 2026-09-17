package com.devhire.dashboard.dto;

public class RecruiterDashboardResponse {

    private long totalJobs;
    private long totalApplications;
    private long shortlisted;
    private long interviews;
    private long offers;

    public RecruiterDashboardResponse(
            long totalJobs,
            long totalApplications,
            long shortlisted,
            long interviews,
            long offers) {

        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.shortlisted = shortlisted;
        this.interviews = interviews;
        this.offers = offers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
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
}