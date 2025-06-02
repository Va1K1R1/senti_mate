package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.service.ChatGPTService;
import com.example.senti_mate_back_end.service.RecommendationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing recommendation operations
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);

    private final RecommendationService recommendationService;
    private final ChatGPTService chatGPTService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService, ChatGPTService chatGPTService) {
        this.recommendationService = recommendationService;
        this.chatGPTService = chatGPTService;
    }

    /**
     * GET /api/recommendations/user/{userId} : Get all recommendations for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the list of recommendations in body
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getAllRecommendationsByUser(@PathVariable Long userId) {
        try {
            List<Recommendation> recommendations = recommendationService.findAllByUser(userId);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/paged : Get all recommendations for a user with pagination
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<Recommendation>> getPagedRecommendationsByUser(
            @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findAllByUser(userId, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/{id} : Get the recommendation with the specified ID
     * @param id the ID of the recommendation to retrieve
     * @return the ResponseEntity with status 200 (OK) and the recommendation in body, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Recommendation> getRecommendationById(@PathVariable Long id) {
        return recommendationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/recommendations/user/{userId}/read-status : Find recommendations by read status
     * @param userId the ID of the user
     * @param isRead the read status
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/read-status")
    public ResponseEntity<Page<Recommendation>> getRecommendationsByReadStatus(
            @PathVariable Long userId,
            @RequestParam boolean isRead,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndReadStatus(userId, isRead, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/favorite-status : Find recommendations by favorite status
     * @param userId the ID of the user
     * @param isFavorite the favorite status
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/favorite-status")
    public ResponseEntity<Page<Recommendation>> getRecommendationsByFavoriteStatus(
            @PathVariable Long userId,
            @RequestParam boolean isFavorite,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndFavoriteStatus(userId, isFavorite, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/category/{category} : Find recommendations by category
     * @param userId the ID of the user
     * @param category the category
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<Page<Recommendation>> getRecommendationsByCategory(
            @PathVariable Long userId,
            @PathVariable String category,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndCategory(userId, category, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/search/title : Search recommendations by title
     * @param userId the ID of the user
     * @param title the title search term
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/search/title")
    public ResponseEntity<Page<Recommendation>> searchRecommendationsByTitle(
            @PathVariable Long userId,
            @RequestParam String title,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndTitleContaining(userId, title, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/search/content : Search recommendations by content
     * @param userId the ID of the user
     * @param content the content search term
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/search/content")
    public ResponseEntity<Page<Recommendation>> searchRecommendationsByContent(
            @PathVariable Long userId,
            @RequestParam String content,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndContentContaining(userId, content, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/date-range : Find recommendations by date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of recommendations in body
     */
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<Page<Recommendation>> getRecommendationsByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        try {
            Page<Recommendation> recommendations = recommendationService.findByUserAndDateRange(userId, startDate, endDate, pageable);
            return ResponseEntity.ok(recommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/recommendations/user/{userId} : Create a new recommendation
     * @param userId the ID of the user
     * @param recommendation the recommendation to create
     * @return the ResponseEntity with status 201 (Created) and the new recommendation in body
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<Recommendation> createRecommendation(
            @PathVariable Long userId,
            @Valid @RequestBody Recommendation recommendation) {
        try {
            Recommendation createdRecommendation = recommendationService.createRecommendation(userId, recommendation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/recommendations/user/{userId}/batch : Create multiple recommendations
     * @param userId the ID of the user
     * @param recommendations the list of recommendations to create
     * @return the ResponseEntity with status 201 (Created) and the list of created recommendations in body
     */
    @PostMapping("/user/{userId}/batch")
    public ResponseEntity<List<Recommendation>> createRecommendations(
            @PathVariable Long userId,
            @Valid @RequestBody List<Recommendation> recommendations) {
        try {
            List<Recommendation> createdRecommendations = recommendationService.createRecommendations(userId, recommendations);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecommendations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/recommendations/{id} : Update an existing recommendation
     * @param id the ID of the recommendation to update
     * @param recommendation the recommendation to update
     * @return the ResponseEntity with status 200 (OK) and the updated recommendation in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PutMapping("/{id}")
    public ResponseEntity<Recommendation> updateRecommendation(
            @PathVariable Long id,
            @Valid @RequestBody Recommendation recommendation) {
        try {
            Recommendation updatedRecommendation = recommendationService.updateRecommendation(id, recommendation);
            return ResponseEntity.ok(updatedRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PATCH /api/recommendations/{id}/mark-read : Mark a recommendation as read
     * @param id the ID of the recommendation to mark as read
     * @return the ResponseEntity with status 200 (OK) and the updated recommendation in body
     */
    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<Recommendation> markRecommendationAsRead(@PathVariable Long id) {
        try {
            Recommendation updatedRecommendation = recommendationService.markAsRead(id);
            return ResponseEntity.ok(updatedRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/recommendations/{id}/mark-unread : Mark a recommendation as unread
     * @param id the ID of the recommendation to mark as unread
     * @return the ResponseEntity with status 200 (OK) and the updated recommendation in body
     */
    @PatchMapping("/{id}/mark-unread")
    public ResponseEntity<Recommendation> markRecommendationAsUnread(@PathVariable Long id) {
        try {
            Recommendation updatedRecommendation = recommendationService.markAsUnread(id);
            return ResponseEntity.ok(updatedRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/recommendations/{id}/toggle-favorite : Toggle the favorite status of a recommendation
     * @param id the ID of the recommendation to toggle favorite status
     * @return the ResponseEntity with status 200 (OK) and the updated recommendation in body
     */
    @PatchMapping("/{id}/toggle-favorite")
    public ResponseEntity<Recommendation> toggleRecommendationFavorite(@PathVariable Long id) {
        try {
            Recommendation updatedRecommendation = recommendationService.toggleFavorite(id);
            return ResponseEntity.ok(updatedRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/recommendations/{id} : Delete the recommendation with the specified ID
     * @param id the ID of the recommendation to delete
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id) {
        try {
            recommendationService.deleteRecommendation(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/count : Count recommendations for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the count in body
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countRecommendationsByUser(@PathVariable Long userId) {
        try {
            long count = recommendationService.countByUser(userId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/count-unread : Count unread recommendations for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the count in body
     */
    @GetMapping("/user/{userId}/count-unread")
    public ResponseEntity<Long> countUnreadRecommendationsByUser(@PathVariable Long userId) {
        try {
            long count = recommendationService.countUnreadByUser(userId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/recommendations/user/{userId}/most-common-categories : Get most common recommendation categories for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the map of categories to their counts in body
     */
    @GetMapping("/user/{userId}/most-common-categories")
    public ResponseEntity<Map<String, Long>> getMostCommonCategories(@PathVariable Long userId) {
        Map<String, Long> categoryCounts = recommendationService.getMostCommonCategories(userId);
        return ResponseEntity.ok(categoryCounts);
    }

    /**
     * POST /api/recommendations/generate : Generate recommendations using ChatGPT
     * @param userId the ID of the user
     * @return the ResponseEntity with status 201 (Created) and the list of generated recommendations in body
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendations(@RequestParam Long userId) {
        try {
            List<Recommendation> recommendations = chatGPTService.generateRecommendations(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(recommendations);
        } catch (Exception e) {
            logger.error("Error generating recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate recommendations: " + e.getMessage()));
        }
    }

    /**
     * POST /api/recommendations/analyze-sentiment : Analyze sentiment of a diary entry
     * @param diaryEntry the diary entry to analyze
     * @return the ResponseEntity with status 200 (OK) and the sentiment analysis in body
     */
    @PostMapping("/analyze-sentiment")
    public ResponseEntity<?> analyzeSentiment(@Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            Map<String, Object> analysis = chatGPTService.analyzeSentiment(diaryEntry);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            logger.error("Error analyzing sentiment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to analyze sentiment: " + e.getMessage()));
        }
    }
}
