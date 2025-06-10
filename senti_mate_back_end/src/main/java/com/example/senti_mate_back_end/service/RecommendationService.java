package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RecommendationRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for managing recommendation operations
 */
@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;

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
        return recommendationRepository.findByUserAndCategory(user, category, pageable);
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
}