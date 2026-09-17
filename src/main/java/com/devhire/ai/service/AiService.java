package com.devhire.ai.service;

import com.devhire.ai.dto.ResumeAnalysisResponse;

public interface AiService {

    ResumeAnalysisResponse analyzeResume(String resumeText);
}