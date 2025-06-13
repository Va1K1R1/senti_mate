package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.service.FileStorageService;
import com.example.senti_mate_back_end.service.UserService;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration class for UserControllerTest
 */
@Configuration
public class UserControllerTestConfig {

    /**
     * Creates a mock UserService bean for testing
     * @return a mock UserService
     */
    @Bean
    @Primary
    public UserService userService() {
        return Mockito.mock(UserService.class);
    }

    /**
     * Creates a mock FileStorageService bean for testing
     * @return a mock FileStorageService
     */
    @Bean
    @Primary
    public FileStorageService fileStorageService() {
        return Mockito.mock(FileStorageService.class);
    }
}
