package com.example.senti_mate_back_end.service;

import org.springframework.stereotype.Service;

/**
 * A simple service to demonstrate testing.
 */
@Service
public class GreetingService {

    /**
     * Returns a greeting message for the given name.
     *
     * @param name the name to greet
     * @return a greeting message
     */
    public String greet(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Hello, Guest!";
        }
        return "Hello, " + name + "!";
    }
}