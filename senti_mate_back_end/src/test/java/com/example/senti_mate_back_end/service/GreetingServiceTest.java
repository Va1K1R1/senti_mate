package com.example.senti_mate_back_end.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Tests for the GreetingService.
 */
@SpringBootTest
public class GreetingServiceTest {

    @Autowired
    private GreetingService greetingService;

    @Test
    public void testGreetWithName() {
        // Given
        String name = "John";
        
        // When
        String greeting = greetingService.greet(name);
        
        // Then
        assertEquals("Hello, John!", greeting);
    }

    @Test
    public void testGreetWithNullName() {
        // Given
        String name = null;
        
        // When
        String greeting = greetingService.greet(name);
        
        // Then
        assertEquals("Hello, Guest!", greeting);
    }

    @Test
    public void testGreetWithEmptyName() {
        // Given
        String name = "";
        
        // When
        String greeting = greetingService.greet(name);
        
        // Then
        assertEquals("Hello, Guest!", greeting);
    }
}