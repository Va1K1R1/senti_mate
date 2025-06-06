package com.example.senti_mate_back_end.adapter;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Adapter controller for todo operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/todos")
public class TodoAdapter {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTodos() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // 임시로 빈 리스트 반환 (실제 구현은 TodoService 연결 필요)
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}