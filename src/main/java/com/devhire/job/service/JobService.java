package com.devhire.job.service;

import com.devhire.job.entity.Job;
import com.devhire.job.repository.JobRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // CREATE JOB
    // =========================================================

    @CacheEvict(
            value = {
                    "jobs",
                    "jobSearch",
                    "recruiterJobs"
            },
            allEntries = true
    )
    public Job createJob(
            Job job,
            String recruiterEmail) {

        User recruiter = userRepository
                .findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Recruiter not found"
                        )
                );

        if (!recruiter.getRole().equals("RECRUITER")) {
            throw new RuntimeException(
                    "Only recruiters can create jobs"
            );
        }

        job.setRecruiter(recruiter);

        return jobRepository.save(job);
    }


    // =========================================================
    // GET ALL JOBS
    // =========================================================

    @Cacheable(
            value = "jobs",
            key = "'all'"
    )
    public List<Job> getAllJobs() {

        return jobRepository.findAll();
    }


    // =========================================================
    // GET JOB BY ID
    // =========================================================

    @Cacheable(
            value = "job",
            key = "#id"
    )
    public Job getJobById(Long id) {

        return jobRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found with id: " + id
                        )
                );
    }


    // =========================================================
    // UPDATE JOB
    // =========================================================

    @Caching(
            evict = {

                    @CacheEvict(
                            value = "jobs",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "jobSearch",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "recruiterJobs",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "job",
                            key = "#id"
                    )
            }
    )
    public Job updateJob(
            Long id,
            Job updatedJob,
            String recruiterEmail) {

        Job existingJob = getJobById(id);

        checkOwnership(
                existingJob,
                recruiterEmail
        );

        existingJob.setTitle(
                updatedJob.getTitle()
        );

        existingJob.setCompany(
                updatedJob.getCompany()
        );

        existingJob.setLocation(
                updatedJob.getLocation()
        );

        existingJob.setDescription(
                updatedJob.getDescription()
        );

        existingJob.setSalary(
                updatedJob.getSalary()
        );

        existingJob.setRequiredSkills(
                updatedJob.getRequiredSkills()
        );

        existingJob.setEmploymentType(
                updatedJob.getEmploymentType()
        );

        return jobRepository.save(existingJob);
    }


    // =========================================================
    // DELETE JOB
    // =========================================================

    @Caching(
            evict = {

                    @CacheEvict(
                            value = "jobs",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "jobSearch",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "recruiterJobs",
                            allEntries = true
                    ),

                    @CacheEvict(
                            value = "job",
                            key = "#id"
                    )
            }
    )
    public void deleteJob(
            Long id,
            String recruiterEmail) {

        Job existingJob = getJobById(id);

        checkOwnership(
                existingJob,
                recruiterEmail
        );

        jobRepository.delete(existingJob);
    }


    // =========================================================
    // COMBINED SEARCH
    // =========================================================

    @Cacheable(
            value = "jobSearch",
            key = "'search:' + #title + ':' + #location + ':' + #employmentType + ':' + #salary"
    )
    public List<Job> searchJobs(
            String title,
            String location,
            String employmentType,
            Long salary) {

        return jobRepository.searchJobs(
                title,
                location,
                employmentType,
                salary
        );
    }


    // =========================================================
    // SEARCH BY TITLE
    // =========================================================

    @Cacheable(
            value = "jobSearch",
            key = "'title:' + #title"
    )
    public List<Job> searchByTitle(
            String title) {

        return jobRepository
                .findByTitleContainingIgnoreCase(title);
    }


    // =========================================================
    // SEARCH BY LOCATION
    // =========================================================

    @Cacheable(
            value = "jobSearch",
            key = "'location:' + #location"
    )
    public List<Job> searchByLocation(
            String location) {

        return jobRepository
                .findByLocationContainingIgnoreCase(
                        location
                );
    }


    // =========================================================
    // FILTER BY EMPLOYMENT TYPE
    // =========================================================

    @Cacheable(
            value = "jobSearch",
            key = "'employmentType:' + #employmentType"
    )
    public List<Job> filterByEmploymentType(
            String employmentType) {

        return jobRepository
                .findByEmploymentTypeIgnoreCase(
                        employmentType
                );
    }


    // =========================================================
    // FILTER BY MINIMUM SALARY
    // =========================================================

    @Cacheable(
            value = "jobSearch",
            key = "'minimumSalary:' + #salary"
    )
    public List<Job> filterByMinimumSalary(
            Long salary) {

        return jobRepository
                .findBySalaryGreaterThanEqual(
                        salary
                );
    }


    // =========================================================
    // GET RECRUITER'S OWN JOBS
    // =========================================================

    @Cacheable(
            value = "recruiterJobs",
            key = "#email"
    )
    public List<Job> getMyJobs(
            String email) {

        User recruiter = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (!recruiter.getRole().equals("RECRUITER")) {
            throw new RuntimeException(
                    "Only recruiters can access their jobs"
            );
        }

        return jobRepository.findByRecruiterId(
                recruiter.getId()
        );
    }


    // =========================================================
    // CHECK JOB OWNERSHIP
    // =========================================================

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
                    "You are not authorized to modify this job"
            );
        }
    }
}