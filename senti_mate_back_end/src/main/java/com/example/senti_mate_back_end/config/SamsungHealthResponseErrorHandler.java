package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.exception.SamsungHealthServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.DefaultResponseErrorHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Error handler for Samsung Health API responses
 */
@Component
@Slf4j
public class SamsungHealthResponseErrorHandler extends DefaultResponseErrorHandler {

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String responseBody = StreamUtils.copyToString(response.getBody(), StandardCharsets.UTF_8);

        log.error("Samsung Health API Error - Status: {}, Body: {}", 
            response.getStatusCode(), responseBody);

        switch (response.getStatusCode().value()) {
            case 401:
                throw new SamsungHealthServiceException("Unauthorized: Invalid credentials or token");
            case 403:
                throw new SamsungHealthServiceException("Forbidden: Insufficient permissions");
            case 404:
                throw new SamsungHealthServiceException("Not Found: Resource not found");
            case 429:
                throw new SamsungHealthServiceException("Rate limit exceeded");
            case 500:
                throw new SamsungHealthServiceException("Samsung Health server error");
            default:
                throw new SamsungHealthServiceException("Samsung Health API error: " + responseBody);
        }
    }
}
