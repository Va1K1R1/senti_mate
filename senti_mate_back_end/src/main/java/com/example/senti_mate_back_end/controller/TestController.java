package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.service.GreetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private GreetingService greetingService;

    @GetMapping("/public/hello")
    public ResponseEntity<?> publicHello() {
        return ResponseEntity.ok(greetingService.greet("Guest"));
    }

    @GetMapping("/secured/hello")
    public ResponseEntity<?> securedHello() {
        // Note: Spring Security has been removed, so this is a simplified version
        String username = "User"; // In a real app, you would get the username from a session or request

        Map<String, Object> response = new HashMap<>();
        response.put("message", greetingService.greet(username));
        response.put("user", username);
        response.put("roles", List.of("USER")); // Simplified roles

        return ResponseEntity.ok(response);
    }
}
