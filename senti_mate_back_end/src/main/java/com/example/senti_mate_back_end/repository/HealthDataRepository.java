package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for HealthData entity
 */
@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, Long> {
    
    /**
     * Find all health data by user
     * @param user the user to search for
     * @return a list of health data for the user
     */
    List<HealthData> findByUser(User user);
    
    /**
     * Find all health data by user with pagination
     * @param user the user to search for
     * @param pageable pagination information
     * @return a page of health data for the user
     */
    Page<HealthData> findByUser(User user, Pageable pageable);
    
    /**
     * Find health data by user and date
     * @param user the user to search for
     * @param date the date to search for
     * @return an Optional containing the health data if found, or empty if not found
     */
    Optional<HealthData> findByUserAndDate(User user, LocalDate date);
    
    /**
     * Find all health data by user and date between
     * @param user the user to search for
     * @param startDate the start date
     * @param endDate the end date
     * @return a list of health data for the user between the start and end dates
     */
    List<HealthData> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find all health data by user and step count greater than or equal to
     * @param user the user to search for
     * @param stepCount the minimum step count
     * @return a list of health data for the user with step count greater than or equal to the specified value
     */
    List<HealthData> findByUserAndStepCountGreaterThanEqual(User user, Integer stepCount);
    
    /**
     * Count health data by user
     * @param user the user to count for
     * @return the number of health data entries for the user
     */
    long countByUser(User user);
    
    /**
     * Find the average step count for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average step count for the user between the start and end dates
     */
    @Query("SELECT AVG(h.stepCount) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :startDate AND :endDate AND h.stepCount IS NOT NULL")
    Double findAverageStepCountByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find the average heart rate for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average heart rate for the user between the start and end dates
     */
    @Query("SELECT AVG(h.heartRateAvg) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :startDate AND :endDate AND h.heartRateAvg IS NOT NULL")
    Double findAverageHeartRateByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find the average sleep duration for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average sleep duration for the user between the start and end dates
     */
    @Query("SELECT AVG(h.sleepDurationMinutes) FROM HealthData h WHERE h.user.id = :userId AND h.date BETWEEN :startDate AND :endDate AND h.sleepDurationMinutes IS NOT NULL")
    Double findAverageSleepDurationByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}