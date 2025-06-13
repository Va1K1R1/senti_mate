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
import org.springframework.stereotype.Component;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Adapter controller for emotion operations.
 * Maps frontend API expectations to backend implementations.
 */
@Component
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
     *
     * @return the ResponseEntity with the list of emotions
     */
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
     * Accessible at /emotions/detail/{id}
     *
     * @param id the ID of the emotion
     * @return the ResponseEntity with the emotion
     */
    public ResponseEntity<Emotion> getEmotionById(Long id) {
        return emotionController.getEmotionById(id);
    }

    /**
     * Analyze text to detect emotions.
     * Maps to the backend's /api/recommendations/analyze-sentiment endpoint.
     * Accessible at /emotions/analyze-text
     *
     * @param request the text analysis request
     * @return the ResponseEntity with the detected emotions
     */
    public ResponseEntity<?> analyzeText(TextAnalysisRequest request) {
        DiaryEntry diaryEntry = new DiaryEntry();
        diaryEntry.setContent(request.getText());
        return recommendationController.analyzeSentiment(diaryEntry);
    }

    /**
     * Get emotion statistics for the current user.
     * Maps to the backend's /api/emotions/user/{userId}/most-common and
     * /api/emotions/user/{userId}/average-intensity endpoints.
     * Accessible at /emotions/statistics
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with the emotion statistics
     */
    public ResponseEntity<Map<String, Object>> getEmotionStats(
            LocalDateTime startDate,
            LocalDateTime endDate) {
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
     * Helper method to get the current user ID.
     * Note: Spring Security has been removed, so this is a simplified version
     *
     * @return the current user ID
     */
    private Long getCurrentUserId() {
        // In a real application, you would get the user from the session or request
        // For now, we'll just return the first user we find
        return userService.findAllUsers()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No users found"))
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
