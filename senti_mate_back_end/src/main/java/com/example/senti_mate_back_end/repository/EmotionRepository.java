package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Repository interface for Emotion entity
 */
@Repository
public interface EmotionRepository extends JpaRepository<Emotion, Long> {

    /**
     * Find all emotions by diary entry
     * @param diaryEntry the diary entry to search for
     * @return a list of emotions for the diary entry
     */
    List<Emotion> findByDiaryEntry(DiaryEntry diaryEntry);

    /**
     * Find all emotions by diary entry and name
     * @param diaryEntry the diary entry to search for
     * @param name the emotion name to search for
     * @return a list of emotions for the diary entry with the specified name
     */
    List<Emotion> findByDiaryEntryAndName(DiaryEntry diaryEntry, String name);

    /**
     * Find all emotions by diary entry and intensity greater than or equal to
     * @param diaryEntry the diary entry to search for
     * @param intensity the minimum intensity
     * @return a list of emotions for the diary entry with intensity greater than or equal to the specified value
     */
    List<Emotion> findByDiaryEntryAndIntensityGreaterThanEqual(DiaryEntry diaryEntry, Integer intensity);

    /**
     * Count emotions by diary entry
     * @param diaryEntry the diary entry to count for
     * @return the number of emotions for the diary entry
     */
    long countByDiaryEntry(DiaryEntry diaryEntry);

    /**
     * Find the most common emotions for a user
     * @param userId the user ID
     * @param limit the maximum number of results to return
     * @return a list of emotion names and their counts, ordered by count descending
     */
    @Query("SELECT e.name, COUNT(e.id) as count FROM Emotion e " +
            "JOIN e.diaryEntry d " +
            "WHERE d.user.id = :userId " +
            "GROUP BY e.name " +
            "ORDER BY count DESC")
    List<Object[]> findMostCommonEmotionsByUserId(@Param("userId") Long userId, @Param("limit") int limit);

    /**
     * Find the average intensity for each emotion for a user
     * @param userId the user ID
     * @return a list of emotion names and their average intensities
     */
    @Query("SELECT e.name, AVG(e.intensity) as avgIntensity FROM Emotion e " +
            "JOIN e.diaryEntry d " +
            "WHERE d.user.id = :userId AND e.intensity IS NOT NULL " +
            "GROUP BY e.name " +
            "ORDER BY avgIntensity DESC")
    List<Object[]> findAverageIntensityByEmotionForUserId(@Param("userId") Long userId);
}
