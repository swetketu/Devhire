package com.devhire.resume.service;

import com.devhire.ai.dto.ResumeAnalysisResponse;
import com.devhire.ai.service.AiService;
import com.devhire.resume.entity.Resume;
import com.devhire.resume.repository.ResumeRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ResumeAnalyzerService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeTextExtractor textExtractor;
    private final AiService aiService;

    public ResumeAnalyzerService(
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            ResumeTextExtractor textExtractor,
            AiService aiService) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.textExtractor = textExtractor;
        this.aiService = aiService;
    }

    public ResumeAnalysisResponse analyzeResume(
            Long resumeId,
            String email) throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to analyze this resume");
        }

        String text = textExtractor.extractText(
                resume.getFilePath()
        );

        if (text == null || text.isBlank()) {
            throw new RuntimeException(
                    "Could not extract text from resume");
        }

        // Send extracted resume text to OpenAI
        return aiService.analyzeResume(text);
    }
}