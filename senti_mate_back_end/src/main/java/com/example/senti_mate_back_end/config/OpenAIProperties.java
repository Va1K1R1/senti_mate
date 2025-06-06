package com.example.senti_mate_back_end.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for OpenAI ChatGPT API
 */
@ConfigurationProperties(prefix = "openai")
@Data
@Component
public class OpenAIProperties {
    private String apiKey;
    private String baseUrl = "https://api.openai.com/v1";
    private String model = "gpt-3.5-turbo";
    private Double temperature = 0.7;
    private Integer maxTokens = 1000;
    private Integer connectTimeout = 10000;
    private Integer readTimeout = 60000;
    private Integer maxRetries = 3;
    private Long retryDelay = 1000L;
}