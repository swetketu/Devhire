package com.devhire.dashboard.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class DashboardCacheService {

    @CacheEvict(
            value = "candidateDashboard",
            key = "#email"
    )
    public void evictCandidateDashboard(String email) {
    }

    @CacheEvict(
            value = "recruiterDashboard",
            key = "#email"
    )
    public void evictRecruiterDashboard(String email) {
    }
}