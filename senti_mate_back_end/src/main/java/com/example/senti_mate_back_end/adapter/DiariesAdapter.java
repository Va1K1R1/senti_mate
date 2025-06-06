package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.DiaryEntryController;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Adapter controller for diaries endpoint.
 * Maps frontend /diaries requests to diary operations.
 */
@RestController
@RequestMapping("/diaries")
public class DiariesAdapter {

    private final DiaryEntryController diaryEntryController;
    private final UserService userService;

    @Autowired
    public DiariesAdapter(DiaryEntryController diaryEntryController, UserService userService) {
        this.diaryEntryController = diaryEntryController;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDiaries() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalStateException("User not found"))
                    .getId();
            
            // Delegate to the DiaryEntryController to get all diary entries for the user
            return diaryEntryController.getAllDiaryEntriesByUser(userId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}