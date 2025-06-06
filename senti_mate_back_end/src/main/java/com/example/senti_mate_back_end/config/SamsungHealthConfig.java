package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.exception.SamsungHealthServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for Samsung Health SDK Web API
 * 🚧 추후 개발 예정 - 현재 Mock 모드로 동작
 */
@Configuration
@EnableConfigurationProperties(SamsungHealthProperties.class)
@EnableRetry
@Slf4j
public class SamsungHealthConfig {

    @Autowired
    private SamsungHealthProperties samsungHealthProperties;

    /**
     * Creates a RestTemplate bean for Samsung Health API calls with proper configuration
     * @return the RestTemplate bean
     */
    @Bean
    @Qualifier("samsungHealthRestTemplate")
    public RestTemplate samsungHealthRestTemplate() {
        log.info("🚧 [MOCK] Samsung Health RestTemplate 생성 - Mock 모드");
        
        RestTemplate restTemplate = new RestTemplate();
        
        // Mock 모드에서는 간단한 설정만
        ClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        ((SimpleClientHttpRequestFactory) factory).setConnectTimeout(samsungHealthProperties.getConnectTimeout());
        ((SimpleClientHttpRequestFactory) factory).setReadTimeout(samsungHealthProperties.getReadTimeout());
        
        restTemplate.setRequestFactory(factory);
        
        // 🚧 실제 구현시 활성화할 부분들
        // restTemplate.setErrorHandler(new SamsungHealthResponseErrorHandler());
        
        return restTemplate;
    }

    // 🚧 passwordEncoder 빈 주석처리 - SecurityConfig에서만 사용
    /*
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    */

    // 🚧 실제 구현시 활성화할 OAuth2 관련 설정들
    /*
    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {
        
        OAuth2AuthorizedClientProvider authorizedClientProvider =
                OAuth2AuthorizedClientProviderBuilder.builder()
                        .authorizationCode()
                        .refreshToken()
                        .build();

        AuthorizedClientServiceOAuth2AuthorizedClientManager authorizedClientManager =
                new AuthorizedClientServiceOAuth2AuthorizedClientManager(
                        clientRegistrationRepository, 
                        (OAuth2AuthorizedClientService) authorizedClientRepository);
        
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }
    */
}