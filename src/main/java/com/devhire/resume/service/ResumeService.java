package com.devhire.resume.service;

import com.devhire.resume.entity.Resume;
import com.devhire.resume.repository.ResumeRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads/resumes";

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume uploadResume(
            MultipartFile file,
            String email) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("Resume file is empty");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null ||
                !fileName.toLowerCase().endsWith(".pdf")) {

            throw new RuntimeException("Only PDF resumes are allowed");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String storedFileName =
                user.getId() + "_" + System.currentTimeMillis()
                        + "_" + fileName;

        Path filePath = uploadPath.resolve(storedFileName);

        Files.copy(file.getInputStream(), filePath);

        Resume resume =
                new Resume(
                        fileName,
                        filePath.toString(),
                        user
                );

        return resumeRepository.save(resume);
    }

    public List<Resume> getMyResumes(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return resumeRepository.findByUserId(user.getId());
    }

    public Resume getResume(
            Long resumeId,
            String email) {

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"
                                ));

        if (!resume.getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "You are not authorized to access this resume"
            );
        }

        return resume;
    }

    public void deleteResume(Long resumeId, String email) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new RuntimeException(
                    "You are not authorized to delete this resume"
            );
        }

        resumeRepository.delete(resume);
    }
}