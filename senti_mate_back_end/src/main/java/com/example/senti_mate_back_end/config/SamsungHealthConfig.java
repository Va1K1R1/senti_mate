package com.example.senti_mate_back_end.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for Samsung Health SDK Web API
 */
@Configuration
public class SamsungHealthConfig {

    @Value("${samsung.health.client-id}")
    private String clientId;

    @Value("${samsung.health.client-secret}")
    private String clientSecret;

    @Value("${samsung.health.redirect-uri}")
    private String redirectUri;

    @Value("${samsung.health.authorization-uri}")
    private String authorizationUri;

    @Value("${samsung.health.token-uri}")
    private String tokenUri;

    @Value("${samsung.health.api-base-url}")
    private String apiBaseUrl;

    /**
     * Creates a RestTemplate bean for Samsung Health API calls
     * @return the RestTemplate bean
     */
    @Bean
    public RestTemplate samsungHealthRestTemplate() {
        return new RestTemplate();
    }

    /**
     * @return the configured client ID
     */
    @Bean
    public String samsungHealthClientId() {
        return clientId;
    }

    /**
     * @return the configured client secret
     */
    @Bean
    public String samsungHealthClientSecret() {
        return clientSecret;
    }

    /**
     * @return the configured redirect URI
     */
    @Bean
    public String samsungHealthRedirectUri() {
        return redirectUri;
    }

    /**
     * @return the configured authorization URI
     */
    @Bean
    public String samsungHealthAuthorizationUri() {
        return authorizationUri;
    }

    /**
     * @return the configured token URI
     */
    @Bean
    public String samsungHealthTokenUri() {
        return tokenUri;
    }

    /**
     * @return the configured API base URL
     */
    @Bean
    public String samsungHealthApiBaseUrl() {
        return apiBaseUrl;
    }
}
