package com.example.senti_mate_back_end.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * Interceptor to add OpenAI API key to requests
 */
@Component
@Slf4j
public class OpenAIApiKeyInterceptor implements ClientHttpRequestInterceptor {

    private final String apiKey;

    public OpenAIApiKeyInterceptor(@Value("${openai.api-key}") String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request, 
            byte[] body, 
            ClientHttpRequestExecution execution) throws IOException {

        // Add API key header
        request.getHeaders().setBearerAuth(apiKey);
        request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        request.getHeaders().setAccept(List.of(MediaType.APPLICATION_JSON));

        // Log request
        log.debug("ChatGPT API Request - Method: {}, URI: {}", 
            request.getMethod(), request.getURI());

        return execution.execute(request, body);
    }
}
