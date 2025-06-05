package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.RecommendationController;
import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Adapter controller for recommendation operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/recommendations")
public class RecommendationAdapter {

    private final RecommendationController recommendationController;
    private final UserService userService;

    @Autowired
    public RecommendationAdapter(RecommendationController recommendationController, UserService userService) {
        this.recommendationController = recommendationController;
        this.userService = userService;
    }

    /**
     * Get all recommendations for the current user.
     * Maps to the backend's /api/recommendations/user/{userId} endpoint.
     *
     * @return the ResponseEntity with the list of recommendations
     */
    @GetMapping
    public ResponseEntity<List<Recommendation>> getAllRecommendations() {
        Long userId = getCurrentUserId();
        return recommendationController.getAllRecommendationsByUser(userId);
    }

    /**
     * Get a specific recommendation by ID.
     * Maps to the backend's /api/recommendations/{id} endpoint.
     *
     * @param id the ID of the recommendation
     * @return the ResponseEntity with the recommendation
     */
    @GetMapping("/{id}")
    public ResponseEntity<Recommendation> getRecommendationById(@PathVariable Long id) {
        return recommendationController.getRecommendationById(id);
    }

    /**
     * Get recommendations by type for the current user.
     * Maps to the backend's /api/recommendations/user/{userId}/category/{category} endpoint.
     *
     * @param type the recommendation type (frontend) / category (backend)
     * @return the ResponseEntity with the list of recommendations
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<Recommendation>> getRecommendationsByType(
            @PathVariable String type,
            Pageable pageable) {
        Long userId = getCurrentUserId();
        return recommendationController.getRecommendationsByCategory(userId, type, pageable);
    }

    /**
     * Generate a new recommendation for the current user.
     * Maps to the backend's /api/recommendations/generate endpoint.
     *
     * @return the ResponseEntity with the generated recommendation
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendation() {
        Long userId = getCurrentUserId();
        return recommendationController.generateRecommendations(userId);
    }

    /**
     * Mark a recommendation as read.
     * Maps to the backend's /api/recommendations/{id}/mark-read endpoint.
     *
     * @param id the ID of the recommendation
     * @return the ResponseEntity with the updated recommendation
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Recommendation> markAsRead(@PathVariable Long id) {
        return recommendationController.markRecommendationAsRead(id);
    }

    /**
     * Mark a recommendation as helpful.
     * Maps to the backend's /api/recommendations/{id}/toggle-favorite endpoint.
     *
     * @param id the ID of the recommendation
     * @param request the helpfulness request
     * @return the ResponseEntity with the updated recommendation
     */
    @PutMapping("/{id}/helpful")
    public ResponseEntity<Recommendation> markHelpfulness(
            @PathVariable Long id,
            @RequestBody HelpfulnessRequest request) {
        // If the recommendation is marked as helpful, toggle it to favorite
        if (request.isHelpful()) {
            return recommendationController.toggleRecommendationFavorite(id);
        }
        // If not helpful, just return the recommendation as is
        return recommendationController.getRecommendationById(id);
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
     * Request class for marking a recommendation as helpful.
     */
    public static class HelpfulnessRequest {
        private boolean isHelpful;

        public boolean isHelpful() {
            return isHelpful;
        }

        public void setHelpful(boolean helpful) {
            isHelpful = helpful;
        }
    }
}