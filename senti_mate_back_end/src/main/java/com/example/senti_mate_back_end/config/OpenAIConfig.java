package com.example.senti_mate_back_end.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for OpenAI ChatGPT API
 */
@Configuration
public class OpenAIConfig {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.max-tokens}")
    private Integer maxTokens;

    @Value("${openai.temperature}")
    private Double temperature;

    /**
     * Creates a RestTemplate bean for API calls
     * @return the RestTemplate bean
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * @return the configured API key
     */
    @Bean
    public String openAiApiKey() {
        return apiKey;
    }

    /**
     * @return the configured model
     */
    @Bean
    public String openAiModel() {
        return model;
    }

    /**
     * @return the configured max tokens
     */
    @Bean
    public Integer openAiMaxTokens() {
        return maxTokens;
    }

    /**
     * @return the configured temperature
     */
    @Bean
    public Double openAiTemperature() {
        return temperature;
    }
}
