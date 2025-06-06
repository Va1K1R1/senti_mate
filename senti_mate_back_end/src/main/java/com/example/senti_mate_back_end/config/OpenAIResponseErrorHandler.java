package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.exception.ChatGPTServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Error handler for OpenAI API responses
 */
@Component
@Slf4j
public class OpenAIResponseErrorHandler implements ResponseErrorHandler {
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String responseBody = StreamUtils.copyToString(response.getBody(), StandardCharsets.UTF_8);
        
        log.error("ChatGPT API Error - Status: {}, Body: {}", 
            response.getStatusCode(), responseBody);
        
        switch (response.getStatusCode().value()) {
            case 401:
                throw new ChatGPTServiceException("Invalid API key");
            case 429:
                throw new ChatGPTServiceException("Rate limit exceeded");
            case 500:
                throw new ChatGPTServiceException("OpenAI server error");
            default:
                throw new ChatGPTServiceException("ChatGPT API error: " + responseBody);
        }
    }
}