package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.dto.RecommendationStatsResponse;
import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.model.RecommendationCategory;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RecommendationRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * Service for managing recommendation operations
 */
@Service
@Slf4j
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;

    @Autowired
    private ChatGPTService chatGPTService;

    @Autowired
    public RecommendationService(RecommendationRepository recommendationRepository, UserRepository userRepository) {
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Find all recommendations for a user
     * @param userId the user ID
     * @return list of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public List<Recommendation> findAllByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUser(user);
    }

    /**
     * Find all recommendations for a user with pagination
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findAllByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUser(user, pageable);
    }

    /**
     * Find recommendation by ID
     * @param id the recommendation ID
     * @return an Optional containing the recommendation if found, or empty if not found
     */
    public Optional<Recommendation> findById(Long id) {
        return recommendationRepository.findById(id);
    }

    /**
     * Find recommendations by read status for a user
     * @param userId the user ID
     * @param isRead the read status
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndReadStatus(Long userId, boolean isRead, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUserAndIsRead(user, isRead, pageable);
    }

    /**
     * Find recommendations by favorite status for a user
     * @param userId the user ID
     * @param isFavorite the favorite status
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndFavoriteStatus(Long userId, boolean isFavorite, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUserAndIsFavorite(user, isFavorite, pageable);
    }

    /**
     * Find recommendations by category for a user
     * @param userId the user ID
     * @param category the category
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndCategory(Long userId, String category, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Try to parse the category string to enum
        try {
            RecommendationCategory categoryEnum = RecommendationCategory.fromString(category);
            return recommendationRepository.findByUserAndCategory(user, categoryEnum, pageable);
        } catch (Exception e) {
            // Fallback to string-based search
            return recommendationRepository.findByUserAndCategoryString(user, category, pageable);
        }
    }

    /**
     * Find recommendations by title containing search term for a user
     * @param userId the user ID
     * @param title the title search term
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndTitleContaining(Long userId, String title, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUserAndTitleContainingIgnoreCase(user, title, pageable);
    }

    /**
     * Find recommendations by content containing search term for a user
     * @param userId the user ID
     * @param content the content search term
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndContentContaining(Long userId, String content, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUserAndContentContainingIgnoreCase(user, content, pageable);
    }

    /**
     * Find recommendations by date range for a user
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> findByUserAndDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.findByUserAndCreatedAtBetween(user, startDate, endDate, pageable);
    }

    /**
     * Create a new recommendation for a user
     * @param userId the user ID
     * @param recommendation the recommendation to create
     * @return the created recommendation
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public Recommendation createRecommendation(Long userId, Recommendation recommendation) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        recommendation.setUser(user);
        return recommendationRepository.save(recommendation);
    }

    /**
     * Update an existing recommendation
     * @param id the recommendation ID
     * @param recommendationDetails the updated recommendation details
     * @return the updated recommendation
     * @throws IllegalArgumentException if the recommendation is not found
     */
    @Transactional
    public Recommendation updateRecommendation(Long id, Recommendation recommendationDetails) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + id));

        // Update recommendation fields
        recommendation.setTitle(recommendationDetails.getTitle());
        recommendation.setContent(recommendationDetails.getContent());
        recommendation.setCategory(recommendationDetails.getCategory());
        recommendation.setPriorityLevel(recommendationDetails.getPriorityLevel());
        recommendation.setSource(recommendationDetails.getSource());
        recommendation.setSourcePrompt(recommendationDetails.getSourcePrompt());
        recommendation.setSourceResponse(recommendationDetails.getSourceResponse());

        return recommendationRepository.save(recommendation);
    }

    /**
     * Mark a recommendation as read
     * @param id the recommendation ID
     * @return the updated recommendation
     * @throws IllegalArgumentException if the recommendation is not found
     */
    @Transactional
    public Recommendation markAsRead(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + id));

        recommendation.setRead(true);
        return recommendationRepository.save(recommendation);
    }

    /**
     * Mark a recommendation as unread
     * @param id the recommendation ID
     * @return the updated recommendation
     * @throws IllegalArgumentException if the recommendation is not found
     */
    @Transactional
    public Recommendation markAsUnread(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + id));

        recommendation.setRead(false);
        return recommendationRepository.save(recommendation);
    }

    /**
     * Toggle favorite status of a recommendation
     * @param id the recommendation ID
     * @return the updated recommendation
     * @throws IllegalArgumentException if the recommendation is not found
     */
    @Transactional
    public Recommendation toggleFavorite(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + id));

        recommendation.setFavorite(!recommendation.isFavorite());
        return recommendationRepository.save(recommendation);
    }

    /**
     * Delete a recommendation
     * @param id the recommendation ID
     * @throws IllegalArgumentException if the recommendation is not found
     */
    @Transactional
    public void deleteRecommendation(Long id) {
        if (!recommendationRepository.existsById(id)) {
            throw new IllegalArgumentException("Recommendation not found with id: " + id);
        }
        recommendationRepository.deleteById(id);
    }

    /**
     * Count recommendations for a user
     * @param userId the user ID
     * @return the number of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public long countByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.countByUser(user);
    }

    /**
     * Count unread recommendations for a user
     * @param userId the user ID
     * @return the number of unread recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public long countUnreadByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return recommendationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Get most common categories for a user
     * @param userId the user ID
     * @return map of categories to their counts, ordered by count descending
     */
    public Map<String, Long> getMostCommonCategories(Long userId) {
        List<Object[]> results = recommendationRepository.findMostCommonCategoriesByUserId(userId);
        Map<String, Long> categoryCounts = new HashMap<>();

        for (Object[] result : results) {
            String category = (String) result[0];
            Long count = ((Number) result[1]).longValue();
            categoryCounts.put(category, count);
        }

        return categoryCounts;
    }

    /**
     * Create multiple recommendations for a user
     * @param userId the user ID
     * @param recommendations the list of recommendations to create
     * @return the list of created recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public List<Recommendation> createRecommendations(Long userId, List<Recommendation> recommendations) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        recommendations.forEach(recommendation -> recommendation.setUser(user));
        return recommendationRepository.saveAll(recommendations);
    }

    /**
     * Generate personalized recommendations for a user
     * @param userId the user ID
     * @return the list of generated recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public List<Recommendation> generatePersonalizedRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Use ChatGPTService to generate recommendations
        List<Recommendation> recommendations = new ArrayList<>();

        // Generate health recommendations
        try {
            String healthRecommendation = chatGPTService.createPersonalizedAdvice(userId, "건강 관리 조언을 원합니다.");

            Recommendation recommendation = Recommendation.builder()
                    .title("맞춤형 건강 추천")
                    .content(healthRecommendation)
                    .category(RecommendationCategory.HEALTH)
                    .priorityLevel(4)
                    .source("ChatGPT")
                    .user(user)
                    .build();

            recommendations.add(recommendation);
        } catch (Exception e) {
            log.error("Error generating health recommendation for user: {}", userId, e);
        }

        // Generate exercise recommendations
        try {
            String exerciseRecommendation = chatGPTService.createPersonalizedAdvice(userId, "운동 추천을 원합니다.");

            Recommendation recommendation = Recommendation.builder()
                    .title("맞춤형 운동 추천")
                    .content(exerciseRecommendation)
                    .category(RecommendationCategory.EXERCISE)
                    .priorityLevel(3)
                    .source("ChatGPT")
                    .user(user)
                    .build();

            recommendations.add(recommendation);
        } catch (Exception e) {
            log.error("Error generating exercise recommendation for user: {}", userId, e);
        }

        // Save and return recommendations
        return recommendationRepository.saveAll(recommendations);
    }

    /**
     * Generate health recommendations asynchronously
     * @param userId the user ID
     * @return a CompletableFuture containing the recommendation
     */
    @Transactional
    public CompletableFuture<Recommendation> generateHealthRecommendationsAsync(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return chatGPTService.generateHealthRecommendations(userId)
                .thenApply(recommendationContent -> {
                    Recommendation recommendation = Recommendation.builder()
                            .title("AI 건강 분석 및 추천")
                            .content(recommendationContent)
                            .category(RecommendationCategory.HEALTH)
                            .priorityLevel(5) // High priority
                            .source("ChatGPT AI")
                            .sourcePrompt("건강 데이터 기반 추천")
                            .sourceResponse(recommendationContent)
                            .user(user)
                            .build();

                    return recommendationRepository.save(recommendation);
                })
                .exceptionally(ex -> {
                    log.error("Error generating health recommendations for user: {}", userId, ex);
                    return null;
                });
    }

    /**
     * Analyze emotional state from diary content asynchronously
     * @param userId the user ID
     * @param diaryContent the diary content to analyze
     * @return a CompletableFuture containing the recommendation
     */
    @Transactional
    public CompletableFuture<Recommendation> analyzeEmotionalStateAsync(Long userId, String diaryContent) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return chatGPTService.analyzeEmotionalState(diaryContent)
                .thenApply(analysisContent -> {
                    Recommendation recommendation = Recommendation.builder()
                            .title("감정 분석 및 조언")
                            .content(analysisContent)
                            .category(RecommendationCategory.MENTAL_HEALTH)
                            .priorityLevel(4) // Medium-high priority
                            .source("ChatGPT AI")
                            .sourcePrompt("일기 내용 감정 분석")
                            .sourceResponse(analysisContent)
                            .user(user)
                            .build();

                    return recommendationRepository.save(recommendation);
                })
                .exceptionally(ex -> {
                    log.error("Error analyzing emotional state for user: {}", userId, ex);
                    return null;
                });
    }

    /**
     * Mark a recommendation as read by ID and user ID
     * @param recommendationId the recommendation ID
     * @param userId the user ID
     * @return the updated recommendation
     * @throws IllegalArgumentException if the recommendation is not found or doesn't belong to the user
     */
    @Transactional
    public Recommendation markAsRead(Long recommendationId, Long userId) {
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new IllegalArgumentException("Recommendation not found with id: " + recommendationId));

        // Check if the recommendation belongs to the user
        if (!recommendation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Recommendation does not belong to user with id: " + userId);
        }

        recommendation.setRead(true);
        return recommendationRepository.save(recommendation);
    }

    /**
     * Get recommendations by category for a user
     * @param userId the user ID
     * @param category the category
     * @param pageable pagination information
     * @return page of recommendations
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Recommendation> getRecommendationsByCategory(Long userId, String category, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Try to parse the category string to enum
        try {
            RecommendationCategory categoryEnum = RecommendationCategory.fromString(category);
            return recommendationRepository.findByUserAndCategory(user, categoryEnum, pageable);
        } catch (Exception e) {
            // Fallback to string-based search
            return recommendationRepository.findByUserAndCategoryString(user, category, pageable);
        }
    }

    /**
     * Get recommendation statistics for a user
     * @param userId the user ID
     * @return the recommendation statistics
     * @throws IllegalArgumentException if the user is not found
     */
    public RecommendationStatsResponse getRecommendationStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Get counts
        long totalCount = recommendationRepository.countByUser(user);
        long unreadCount = recommendationRepository.countByUserAndIsReadFalse(user);
        long favoriteCount = recommendationRepository.countByUserAndIsFavorite(user, true);

        // Get counts by category
        Map<RecommendationCategory, Long> countByCategory = new HashMap<>();
        Map<RecommendationCategory, Long> unreadByCategory = new HashMap<>();

        for (RecommendationCategory category : RecommendationCategory.values()) {
            countByCategory.put(category, recommendationRepository.countByUserAndCategory(user, category));
            unreadByCategory.put(category, recommendationRepository.countByUserAndIsReadFalseAndCategory(user, category));
        }

        // Get counts by priority level
        Map<Integer, Long> countByPriorityLevel = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int level = i;
            countByPriorityLevel.put(level, recommendationRepository.findByUserAndPriorityLevel(user, level, Pageable.unpaged()).getTotalElements());
        }

        // Get most common category
        List<Object[]> mostCommonCategories = recommendationRepository.findMostCommonCategoriesByUserId(userId);
        RecommendationCategory mostCommonCategory = mostCommonCategories.isEmpty() ? 
                RecommendationCategory.GENERAL : (RecommendationCategory) mostCommonCategories.get(0)[0];

        // Get highest priority unread
        Integer highestPriorityUnread = null;
        for (int i = 5; i >= 1; i--) {
            final int level = i;
            long count = recommendationRepository.findByUserAndPriorityLevelGreaterThanEqual(user, level, Pageable.unpaged())
                    .getContent().stream()
                    .filter(r -> !r.isRead())
                    .count();
            if (count > 0) {
                highestPriorityUnread = level;
                break;
            }
        }

        // Build and return response
        return RecommendationStatsResponse.builder()
                .userId(userId)
                .totalCount(totalCount)
                .unreadCount(unreadCount)
                .favoriteCount(favoriteCount)
                .countByCategory(countByCategory)
                .unreadByCategory(unreadByCategory)
                .countByPriorityLevel(countByPriorityLevel)
                .mostCommonCategory(mostCommonCategory)
                .highestPriorityUnread(highestPriorityUnread)
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
