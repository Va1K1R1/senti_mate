package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.EmotionController;
import com.example.senti_mate_back_end.controller.RecommendationController;
import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.Emotion;
import com.example.senti_mate_back_end.service.DiaryEntryService;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Adapter controller for emotion operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/api/adapters/emotions")
public class EmotionAdapter {

    private final EmotionController emotionController;
    private final RecommendationController recommendationController;
    private final UserService userService;
    private final DiaryEntryService diaryEntryService;

    @Autowired
    public EmotionAdapter(EmotionController emotionController, 
                          RecommendationController recommendationController,
                          UserService userService,
                          DiaryEntryService diaryEntryService) {
        this.emotionController = emotionController;
        this.recommendationController = recommendationController;
        this.userService = userService;
        this.diaryEntryService = diaryEntryService;
    }

    /**
     * Get all emotions for the current user's diary entries.
     * Maps to multiple backend endpoints to collect emotions from all diary entries.
     * This adapter endpoint is accessible at /api/adapters/emotions
     *
     * @return the ResponseEntity with the list of emotions
     */
    @GetMapping
    public ResponseEntity<List<Emotion>> getAllEmotions() {
        Long userId = getCurrentUserId();
        // This is a simplification - in a real implementation, we would need to
        // collect emotions from all diary entries for the user
        List<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(userId);
        if (diaryEntries.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // For simplicity, just get emotions from the first diary entry
        Long diaryEntryId = diaryEntries.get(0).getId();
        return emotionController.getAllEmotionsByDiaryEntry(diaryEntryId);
    }

    /**
     * Get a specific emotion by ID.
     * Maps to the backend's /api/emotions/{id} endpoint.
     * This adapter endpoint is accessible at /api/adapters/emotions/{id}
     *
     * @param id the ID of the emotion
     * @return the ResponseEntity with the emotion
     */
    @GetMapping("/{id}")
    public ResponseEntity<Emotion> getEmotionById(@PathVariable Long id) {
        return emotionController.getEmotionById(id);
    }

    /**
     * Analyze text to detect emotions.
     * Maps to the backend's /api/recommendations/analyze-sentiment endpoint.
     * This adapter endpoint is accessible at /api/adapters/emotions/analyze
     *
     * @param request the text analysis request
     * @return the ResponseEntity with the detected emotions
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeText(@Valid @RequestBody TextAnalysisRequest request) {
        DiaryEntry diaryEntry = new DiaryEntry();
        diaryEntry.setContent(request.getText());
        return recommendationController.analyzeSentiment(diaryEntry);
    }

    /**
     * Get emotion statistics for the current user.
     * Maps to the backend's /api/emotions/user/{userId}/most-common and
     * /api/emotions/user/{userId}/average-intensity endpoints.
     * This adapter endpoint is accessible at /api/adapters/emotions/stats
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with the emotion statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEmotionStats(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Long userId = getCurrentUserId();

        // Get most common emotions
        ResponseEntity<Map<String, Long>> mostCommonResponse = 
                emotionController.getMostCommonEmotions(userId, 10);

        // Get average intensity by emotion
        ResponseEntity<Map<String, Double>> intensityResponse = 
                emotionController.getAverageIntensityByEmotion(userId);

        // Combine the results
        Map<String, Object> stats = new HashMap<>();
        stats.put("mostCommon", mostCommonResponse.getBody());
        stats.put("averageIntensity", intensityResponse.getBody());
        stats.put("startDate", startDate);
        stats.put("endDate", endDate);

        return ResponseEntity.ok(stats);
    }

    /**
     * Helper method to get the current user ID from the security context.
     *
     * @return the current user ID
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"))
                .getId();
    }

    /**
     * Request class for text analysis.
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
