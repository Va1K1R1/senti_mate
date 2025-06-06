package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.model.RecommendationCategory;
import com.example.senti_mate_back_end.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Recommendation entity
 */
@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    /**
     * Find all recommendations by user
     * @param user the user to search for
     * @return a list of recommendations for the user
     */
    List<Recommendation> findByUser(User user);

    /**
     * Find all recommendations by user with pagination
     * @param user the user to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user
     */
    Page<Recommendation> findByUser(User user, Pageable pageable);

    /**
     * Find all recommendations by user and is read
     * @param user the user to search for
     * @param isRead whether the recommendation has been read
     * @param pageable pagination information
     * @return a page of recommendations for the user with the specified read status
     */
    Page<Recommendation> findByUserAndIsRead(User user, boolean isRead, Pageable pageable);

    /**
     * Find all recommendations by user and is favorite
     * @param user the user to search for
     * @param isFavorite whether the recommendation is a favorite
     * @param pageable pagination information
     * @return a page of recommendations for the user with the specified favorite status
     */
    Page<Recommendation> findByUserAndIsFavorite(User user, boolean isFavorite, Pageable pageable);

    /**
     * Find all recommendations by user and category
     * @param user the user to search for
     * @param category the category to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with the specified category
     */
    Page<Recommendation> findByUserAndCategory(User user, RecommendationCategory category, Pageable pageable);

    /**
     * Find all recommendations by user and category string (for backward compatibility)
     * @param user the user to search for
     * @param categoryStr the category string to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with the specified category
     */
    @Query("SELECT r FROM Recommendation r WHERE r.user = :user AND CAST(r.category AS string) = :categoryStr")
    Page<Recommendation> findByUserAndCategoryString(@Param("user") User user, @Param("categoryStr") String categoryStr, Pageable pageable);

    /**
     * Find all recommendations by user and title containing
     * @param user the user to search for
     * @param title the title to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with titles containing the search term
     */
    Page<Recommendation> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);

    /**
     * Find all recommendations by user and content containing
     * @param user the user to search for
     * @param content the content to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with content containing the search term
     */
    Page<Recommendation> findByUserAndContentContainingIgnoreCase(User user, String content, Pageable pageable);

    /**
     * Find all recommendations by user and created date between
     * @param user the user to search for
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return a page of recommendations for the user created between the start and end dates
     */
    Page<Recommendation> findByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Count recommendations by user
     * @param user the user to count for
     * @return the number of recommendations for the user
     */
    long countByUser(User user);

    /**
     * Count unread recommendations by user
     * @param user the user to count for
     * @return the number of unread recommendations for the user
     */
    long countByUserAndIsReadFalse(User user);

    /**
     * Count favorite recommendations by user
     * @param user the user to count for
     * @param isFavorite whether the recommendation is a favorite
     * @return the number of favorite recommendations for the user
     */
    long countByUserAndIsFavorite(User user, boolean isFavorite);

    /**
     * Find the most common categories for a user
     * @param userId the user ID
     * @return a list of categories and their counts, ordered by count descending
     */
    @Query("SELECT r.category, COUNT(r.id) as count FROM Recommendation r " +
            "WHERE r.user.id = :userId AND r.category IS NOT NULL " +
            "GROUP BY r.category " +
            "ORDER BY count DESC")
    List<Object[]> findMostCommonCategoriesByUserId(@Param("userId") Long userId);

    /**
     * Count recommendations by user and category
     * @param user the user to count for
     * @param category the category to count for
     * @return the number of recommendations for the user with the specified category
     */
    long countByUserAndCategory(User user, RecommendationCategory category);

    /**
     * Find all recommendations by user and priority level
     * @param user the user to search for
     * @param priorityLevel the priority level to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with the specified priority level
     */
    Page<Recommendation> findByUserAndPriorityLevel(User user, Integer priorityLevel, Pageable pageable);

    /**
     * Find all recommendations by user and priority level greater than or equal to
     * @param user the user to search for
     * @param priorityLevel the minimum priority level to search for
     * @param pageable pagination information
     * @return a page of recommendations for the user with priority level >= the specified level
     */
    Page<Recommendation> findByUserAndPriorityLevelGreaterThanEqual(User user, Integer priorityLevel, Pageable pageable);

    /**
     * Count unread recommendations by user and category
     * @param user the user to count for
     * @param category the category to count for
     * @return the number of unread recommendations for the user with the specified category
     */
    long countByUserAndIsReadFalseAndCategory(User user, RecommendationCategory category);
}
