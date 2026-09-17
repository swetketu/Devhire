package com.devhire.ai.service;

import com.devhire.ai.dto.ResumeAnalysisResponse;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.ResponseCreateParams;
import org.springframework.stereotype.Service;

@Service
public class AiServiceImpl implements AiService {

    private final OpenAIClient client;

    public AiServiceImpl() {
        this.client = OpenAIOkHttpClient.fromEnv();
    }

    @Override
    public ResumeAnalysisResponse analyzeResume(String resumeText) {

        String prompt = """
                Analyze the following resume professionally.

                Return:
                1. Overall score from 0 to 100
                2. Technical skills
                3. Strengths
                4. Improvements

                Resume:

                %s
                """.formatted(resumeText);

        ResponseCreateParams params =
                ResponseCreateParams.builder()
                        .input(prompt)
                        .model(ChatModel.GPT_5_2)
                        .build();

        var response = client.responses().create(params);

        String result = response.output()
                .stream()
                .flatMap(item -> item.message().stream())
                .flatMap(message -> message.content().stream())
                .flatMap(content -> content.outputText().stream())
                .map(outputText -> outputText.text())
                .findFirst()
                .orElse("");

        System.out.println("AI RESPONSE:");
        System.out.println(result);

        // Temporary conversion
        return new ResumeAnalysisResponse(
                0,
                java.util.List.of(),
                java.util.List.of(result),
                java.util.List.of()
        );
    }
}