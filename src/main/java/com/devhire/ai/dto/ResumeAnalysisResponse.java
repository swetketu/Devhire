package com.devhire.ai.dto;

import java.util.List;

public class ResumeAnalysisResponse {

    private int score;
    private List<String> skills;
    private List<String> strengths;
    private List<String> improvements;

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(
            int score,
            List<String> skills,
            List<String> strengths,
            List<String> improvements) {

        this.score = score;
        this.skills = skills;
        this.strengths = strengths;
        this.improvements = improvements;
    }

    public int getScore() {
        return score;
    }

    public List<String> getSkills() {
        return skills;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }
}