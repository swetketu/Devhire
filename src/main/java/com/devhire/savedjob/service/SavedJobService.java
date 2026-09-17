package com.devhire.savedjob.service;

import com.devhire.job.entity.Job;
import com.devhire.job.repository.JobRepository;
import com.devhire.savedjob.entity.SavedJob;
import com.devhire.savedjob.repository.SavedJobRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public SavedJobService(
            SavedJobRepository savedJobRepository,
            UserRepository userRepository,
            JobRepository jobRepository) {

        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public String saveJob(Long jobId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (!user.getRole().equals("CANDIDATE")) {
            throw new RuntimeException(
                    "Only candidates can save jobs");
        }

        if (savedJobRepository.existsByUserIdAndJobId(
                user.getId(),
                job.getId())) {

            throw new RuntimeException(
                    "Job already saved");
        }

        SavedJob savedJob = new SavedJob(user, job);

        savedJobRepository.save(savedJob);

        return "Job saved successfully";
    }

    public String unsaveJob(Long jobId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        SavedJob savedJob =
                savedJobRepository.findByUserIdAndJobId(
                        user.getId(),
                        jobId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Saved job not found"));

        savedJobRepository.delete(savedJob);

        return "Job removed from saved jobs";
    }

    public List<SavedJob> getSavedJobs(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return savedJobRepository.findByUserId(
                user.getId()
        );
    }
}