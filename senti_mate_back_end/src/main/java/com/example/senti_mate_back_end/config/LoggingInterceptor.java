package com.example.senti_mate_back_end.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Interceptor to log request and response details
 */
@Component
@Slf4j
public class LoggingInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request, 
            byte[] body, 
            ClientHttpRequestExecution execution) throws IOException {
        
        // Log request
        logRequest(request, body);
        
        // Execute request
        ClientHttpResponse response = execution.execute(request, body);
        
        // Log response
        logResponse(response);
        
        return response;
    }
    
    private void logRequest(HttpRequest request, byte[] body) {
        if (log.isDebugEnabled()) {
            log.debug("=========================== REQUEST ===========================");
            log.debug("URI: {}", request.getURI());
            log.debug("Method: {}", request.getMethod());
            log.debug("Headers: {}", request.getHeaders());
            log.debug("Request body: {}", new String(body, StandardCharsets.UTF_8));
            log.debug("==============================================================");
        }
    }
    
    private void logResponse(ClientHttpResponse response) throws IOException {
        if (log.isDebugEnabled()) {
            log.debug("=========================== RESPONSE ==========================");
            log.debug("Status code: {}", response.getStatusCode());
            log.debug("Headers: {}", response.getHeaders());
            
            // Only log response body for debugging
            if (log.isTraceEnabled()) {
                String responseBody = StreamUtils.copyToString(response.getBody(), StandardCharsets.UTF_8);
                log.trace("Response body: {}", responseBody);
            }
            
            log.debug("==============================================================");
        }
    }
}