package com.example.senti_mate_back_end.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for Samsung Health SDK Web API
 */
@ConfigurationProperties(prefix = "samsung.health")
@Data
@Component
public class SamsungHealthProperties {
    private String clientId;
    private String clientSecret;
    private String redirectUri;
    private String authorizationUri;
    private String tokenUri;
    private String apiBaseUrl;
    private String scope = "activity sleep heart_rate exercise";
    private Integer connectTimeout = 10000;
    private Integer readTimeout = 30000;
    private Integer maxRetries = 3;
    private Long retryDelay = 1000L;
    private Encryption encryption = new Encryption();
    
    @Data
    public static class Encryption {
        private String key = "defaultEncryptionKey12345678901234567890";
    }
}