package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.service.GreetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", greetingService.greet(username));
        response.put("user", username);
        response.put("roles", authentication.getAuthorities());
        
        return ResponseEntity.ok(response);
    }
}