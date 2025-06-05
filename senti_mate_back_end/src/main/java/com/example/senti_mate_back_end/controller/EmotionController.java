package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.Emotion;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.EmotionService;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing emotion operations
 */
@RestController
@RequestMapping("/emotions")
public class EmotionController {

    private final EmotionService emotionService;
    private final UserService userService;

    @Autowired
    public EmotionController(EmotionService emotionService, UserService userService) {
        this.emotionService = emotionService;
        this.userService = userService;
    }

    /**
     * Get the current user ID from the authentication context
     * @return the current user ID
     * @throws IllegalStateException if the user is not authenticated or not found
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        String username = authentication.getName();
        return userService.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
    }

    /**
     * GET /api/emotions/diary/{diaryEntryId} : Get all emotions for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @return the ResponseEntity with status 200 (OK) and the list of emotions in body
     */
    @GetMapping("/diary/{diaryEntryId}")
    public ResponseEntity<List<Emotion>> getAllEmotionsByDiaryEntry(@PathVariable Long diaryEntryId) {
        try {
            List<Emotion> emotions = emotionService.findByDiaryEntry(diaryEntryId);
            return ResponseEntity.ok(emotions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/emotions/{id} : Get the emotion with the specified ID
     * @param id the ID of the emotion to retrieve
     * @return the ResponseEntity with status 200 (OK) and the emotion in body, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Emotion> getEmotionById(@PathVariable Long id) {
        return emotionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/emotions/diary/{diaryEntryId}/name/{name} : Find emotions by name for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @param name the emotion name
     * @return the ResponseEntity with status 200 (OK) and the list of emotions in body
     */
    @GetMapping("/diary/{diaryEntryId}/name/{name}")
    public ResponseEntity<List<Emotion>> getEmotionsByDiaryEntryAndName(
            @PathVariable Long diaryEntryId,
            @PathVariable String name) {
        try {
            List<Emotion> emotions = emotionService.findByDiaryEntryAndName(diaryEntryId, name);
            return ResponseEntity.ok(emotions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/emotions/diary/{diaryEntryId}/intensity/{minIntensity} : Find emotions by minimum intensity for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @param minIntensity the minimum intensity
     * @return the ResponseEntity with status 200 (OK) and the list of emotions in body
     */
    @GetMapping("/diary/{diaryEntryId}/intensity/{minIntensity}")
    public ResponseEntity<List<Emotion>> getEmotionsByDiaryEntryAndMinIntensity(
            @PathVariable Long diaryEntryId,
            @PathVariable Integer minIntensity) {
        try {
            List<Emotion> emotions = emotionService.findByDiaryEntryAndMinIntensity(diaryEntryId, minIntensity);
            return ResponseEntity.ok(emotions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/emotions/diary/{diaryEntryId} : Create a new emotion for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @param emotion the emotion to create
     * @return the ResponseEntity with status 201 (Created) and the new emotion in body
     */
    @PostMapping("/diary/{diaryEntryId}")
    public ResponseEntity<Emotion> createEmotion(
            @PathVariable Long diaryEntryId,
            @Valid @RequestBody Emotion emotion) {
        try {
            Emotion createdEmotion = emotionService.createEmotion(diaryEntryId, emotion);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmotion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/emotions/diary/{diaryEntryId}/batch : Create multiple emotions for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @param emotions the list of emotions to create
     * @return the ResponseEntity with status 201 (Created) and the list of created emotions in body
     */
    @PostMapping("/diary/{diaryEntryId}/batch")
    public ResponseEntity<List<Emotion>> createEmotions(
            @PathVariable Long diaryEntryId,
            @Valid @RequestBody List<Emotion> emotions) {
        try {
            List<Emotion> createdEmotions = emotionService.createEmotions(diaryEntryId, emotions);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmotions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/emotions/{id} : Update an existing emotion
     * @param id the ID of the emotion to update
     * @param emotion the emotion to update
     * @return the ResponseEntity with status 200 (OK) and the updated emotion in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PutMapping("/{id}")
    public ResponseEntity<Emotion> updateEmotion(
            @PathVariable Long id,
            @Valid @RequestBody Emotion emotion) {
        try {
            Emotion updatedEmotion = emotionService.updateEmotion(id, emotion);
            return ResponseEntity.ok(updatedEmotion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/emotions/{id} : Delete the emotion with the specified ID
     * @param id the ID of the emotion to delete
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmotion(@PathVariable Long id) {
        try {
            emotionService.deleteEmotion(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/emotions/diary/{diaryEntryId}/count : Count emotions for a diary entry
     * @param diaryEntryId the ID of the diary entry
     * @return the ResponseEntity with status 200 (OK) and the count in body
     */
    @GetMapping("/diary/{diaryEntryId}/count")
    public ResponseEntity<Long> countEmotionsByDiaryEntry(@PathVariable Long diaryEntryId) {
        try {
            long count = emotionService.countByDiaryEntry(diaryEntryId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/emotions/user/{userId}/most-common : Get most common emotions for a user
     * @param userId the ID of the user
     * @param limit the maximum number of results to return
     * @return the ResponseEntity with status 200 (OK) and the map of emotion names to their counts in body
     */
    @GetMapping("/user/{userId}/most-common")
    public ResponseEntity<Map<String, Long>> getMostCommonEmotions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        Map<String, Long> emotionCounts = emotionService.getMostCommonEmotions(userId, limit);
        return ResponseEntity.ok(emotionCounts);
    }

    /**
     * GET /emotions : Get most common emotions for the current user
     * @param limit the maximum number of results to return
     * @return the ResponseEntity with status 200 (OK) and the map of emotion names to their counts in body
     */
    @GetMapping
    public ResponseEntity<Map<String, Long>> getMostCommonEmotions(
            @RequestParam(defaultValue = "5") int limit) {
        try {
            Long userId = getCurrentUserId();
            Map<String, Long> emotionCounts = emotionService.getMostCommonEmotions(userId, limit);
            return ResponseEntity.ok(emotionCounts);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/emotions/user/{userId}/average-intensity : Get average intensity by emotion for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the map of emotion names to their average intensities in body
     */
    @GetMapping("/user/{userId}/average-intensity")
    public ResponseEntity<Map<String, Double>> getAverageIntensityByEmotion(@PathVariable Long userId) {
        Map<String, Double> emotionIntensities = emotionService.getAverageIntensityByEmotion(userId);
        return ResponseEntity.ok(emotionIntensities);
    }

    /**
     * POST /emotions/analyze : Analyze text to detect emotions
     * @param request the request containing the text to analyze
     * @return the ResponseEntity with status 200 (OK) and the detected emotions in body
     */
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeText(@RequestBody TextAnalysisRequest request) {
        try {
            // This is a placeholder implementation since the actual text analysis functionality
            // would require integration with a natural language processing service
            Map<String, Object> result = new HashMap<>();
            result.put("text", request.getText());

            // Return some placeholder emotions based on simple keyword matching
            Map<String, Integer> emotions = new HashMap<>();
            String text = request.getText().toLowerCase();

            if (text.contains("happy") || text.contains("joy") || text.contains("excited")) {
                emotions.put("joy", 4);
            }
            if (text.contains("sad") || text.contains("unhappy") || text.contains("depressed")) {
                emotions.put("sadness", 3);
            }
            if (text.contains("angry") || text.contains("mad") || text.contains("furious")) {
                emotions.put("anger", 4);
            }
            if (text.contains("afraid") || text.contains("scared") || text.contains("fearful")) {
                emotions.put("fear", 3);
            }
            if (text.contains("surprised") || text.contains("amazed") || text.contains("astonished")) {
                emotions.put("surprise", 3);
            }

            // If no emotions were detected, add a neutral emotion
            if (emotions.isEmpty()) {
                emotions.put("neutral", 2);
            }

            result.put("emotions", emotions);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /emotions/stats : Get emotion statistics for a date range for the current user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the emotion statistics in body
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEmotionStats(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        try {
            Long userId = getCurrentUserId();

            // Get most common emotions and average intensity by emotion for the current user
            Map<String, Long> mostCommonEmotions = emotionService.getMostCommonEmotions(userId, 10);
            Map<String, Double> averageIntensities = emotionService.getAverageIntensityByEmotion(userId);

            // Combine the results into a single response
            Map<String, Object> stats = new HashMap<>();
            stats.put("mostCommonEmotions", mostCommonEmotions);
            stats.put("averageIntensities", averageIntensities);
            stats.put("startDate", startDate);
            stats.put("endDate", endDate);

            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Request class for text analysis
     */
    public static class TextAnalysisRequest {
        private String text;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
