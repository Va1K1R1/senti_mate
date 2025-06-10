package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.DiaryEntry;
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
 * Repository interface for DiaryEntry entity
 */
@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    /**
     * Find all diary entries by user
     * @param user the user to search for
     * @return a list of diary entries for the user
     */
    List<DiaryEntry> findByUser(User user);

    /**
     * Find all diary entries by user with pagination
     * @param user the user to search for
     * @param pageable pagination information
     * @return a page of diary entries for the user
     */
    Page<DiaryEntry> findByUser(User user, Pageable pageable);

    /**
     * Find all diary entries by user and title containing
     * @param user the user to search for
     * @param title the title to search for
     * @param pageable pagination information
     * @return a page of diary entries for the user with titles containing the search term
     */
    Page<DiaryEntry> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);

    /**
     * Find all diary entries by user and content containing
     * @param user the user to search for
     * @param content the content to search for
     * @param pageable pagination information
     * @return a page of diary entries for the user with content containing the search term
     */
    Page<DiaryEntry> findByUserAndContentContainingIgnoreCase(User user, String content, Pageable pageable);

    /**
     * Find all diary entries by user and created date between
     * @param user the user to search for
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return a page of diary entries for the user created between the start and end dates
     */
    Page<DiaryEntry> findByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find all diary entries by user and mood score between
     * @param user the user to search for
     * @param minScore the minimum mood score
     * @param maxScore the maximum mood score
     * @param pageable pagination information
     * @return a page of diary entries for the user with mood scores between the min and max values
     */
    Page<DiaryEntry> findByUserAndMoodScoreBetween(User user, Integer minScore, Integer maxScore, Pageable pageable);

    /**
     * Count diary entries by user
     * @param user the user to count for
     * @return the number of diary entries for the user
     */
    long countByUser(User user);

    /**
     * Find the average mood score for a user
     * @param userId the user ID
     * @return the average mood score for the user
     */
    @Query("SELECT AVG(d.moodScore) FROM DiaryEntry d WHERE d.user.id = :userId AND d.moodScore IS NOT NULL")
    Double findAverageMoodScoreByUserId(@Param("userId") Long userId);

    /**
     * Find all diary entries by user and specific mood score
     * @param user the user to search for
     * @param moodScore the specific mood score to search for
     * @param pageable pagination information
     * @return a page of diary entries for the user with the specified mood score
     */
    Page<DiaryEntry> findByUserAndMoodScore(User user, Integer moodScore, Pageable pageable);
}
