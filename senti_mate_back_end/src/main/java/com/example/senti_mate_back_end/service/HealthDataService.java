package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.HealthDataRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing health data operations
 */
@Service
public class HealthDataService {

    private final HealthDataRepository healthDataRepository;
    private final UserRepository userRepository;

    @Autowired
    public HealthDataService(HealthDataRepository healthDataRepository, UserRepository userRepository) {
        this.healthDataRepository = healthDataRepository;
        this.userRepository = userRepository;
    }

    /**
     * Find all health data for a user
     * @param userId the user ID
     * @return list of health data
     * @throws IllegalArgumentException if the user is not found
     */
    public List<HealthData> findAllByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.findByUser(user);
    }

    /**
     * Find all health data for a user with pagination
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of health data
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<HealthData> findAllByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.findByUser(user, pageable);
    }

    /**
     * Find health data by ID
     * @param id the health data ID
     * @return an Optional containing the health data if found, or empty if not found
     */
    public Optional<HealthData> findById(Long id) {
        return healthDataRepository.findById(id);
    }

    /**
     * Find health data by user and date
     * @param userId the user ID
     * @param date the date
     * @return an Optional containing the health data if found, or empty if not found
     * @throws IllegalArgumentException if the user is not found
     */
    public Optional<HealthData> findByUserAndDate(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.findByUserAndDate(user, date);
    }

    /**
     * Find health data by user and date range
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return list of health data
     * @throws IllegalArgumentException if the user is not found
     */
    public List<HealthData> findByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.findByUserAndDateBetweenOrderByDateAsc(user, startDate, endDate);
    }

    /**
     * Find health data by user and minimum step count
     * @param userId the user ID
     * @param minStepCount the minimum step count
     * @return list of health data
     * @throws IllegalArgumentException if the user is not found
     */
    public List<HealthData> findByUserAndMinStepCount(Long userId, Integer minStepCount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.findByUserAndStepCountGreaterThanEqual(user, minStepCount);
    }

    /**
     * Create or update health data for a user on a specific date
     * @param userId the user ID
     * @param healthData the health data to create or update
     * @return the created or updated health data
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public HealthData createOrUpdateHealthData(Long userId, HealthData healthData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        // Check if health data already exists for this date
        Optional<HealthData> existingData = healthDataRepository.findByUserAndDate(user, healthData.getDate());
        
        if (existingData.isPresent()) {
            // Update existing health data
            HealthData existing = existingData.get();
            
            // Update fields if provided in the new data
            if (healthData.getStepCount() != null) {
                existing.setStepCount(healthData.getStepCount());
            }
            if (healthData.getHeartRateAvg() != null) {
                existing.setHeartRateAvg(healthData.getHeartRateAvg());
            }
            if (healthData.getHeartRateMin() != null) {
                existing.setHeartRateMin(healthData.getHeartRateMin());
            }
            if (healthData.getHeartRateMax() != null) {
                existing.setHeartRateMax(healthData.getHeartRateMax());
            }
            if (healthData.getSleepDurationMinutes() != null) {
                existing.setSleepDurationMinutes(healthData.getSleepDurationMinutes());
            }
            if (healthData.getDeepSleepMinutes() != null) {
                existing.setDeepSleepMinutes(healthData.getDeepSleepMinutes());
            }
            if (healthData.getLightSleepMinutes() != null) {
                existing.setLightSleepMinutes(healthData.getLightSleepMinutes());
            }
            if (healthData.getRemSleepMinutes() != null) {
                existing.setRemSleepMinutes(healthData.getRemSleepMinutes());
            }
            if (healthData.getCaloriesBurned() != null) {
                existing.setCaloriesBurned(healthData.getCaloriesBurned());
            }
            if (healthData.getExerciseDurationMinutes() != null) {
                existing.setExerciseDurationMinutes(healthData.getExerciseDurationMinutes());
            }
            if (healthData.getExerciseType() != null) {
                existing.setExerciseType(healthData.getExerciseType());
            }
            if (healthData.getDataSource() != null) {
                existing.setDataSource(healthData.getDataSource());
            }
            if (healthData.getSyncStatus() != null) {
                existing.setSyncStatus(healthData.getSyncStatus());
            }
            
            return healthDataRepository.save(existing);
        } else {
            // Create new health data
            healthData.setUser(user);
            return healthDataRepository.save(healthData);
        }
    }

    /**
     * Delete health data
     * @param id the health data ID
     * @throws IllegalArgumentException if the health data is not found
     */
    @Transactional
    public void deleteHealthData(Long id) {
        if (!healthDataRepository.existsById(id)) {
            throw new IllegalArgumentException("Health data not found with id: " + id);
        }
        healthDataRepository.deleteById(id);
    }

    /**
     * Count health data for a user
     * @param userId the user ID
     * @return the number of health data entries
     * @throws IllegalArgumentException if the user is not found
     */
    public long countByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return healthDataRepository.countByUser(user);
    }

    /**
     * Get average step count for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average step count, or null if no step counts are available
     */
    public Double getAverageStepCount(Long userId, LocalDate startDate, LocalDate endDate) {
        return healthDataRepository.findAverageStepCountByUserIdAndDateBetween(userId, startDate, endDate);
    }

    /**
     * Get average heart rate for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average heart rate, or null if no heart rates are available
     */
    public Double getAverageHeartRate(Long userId, LocalDate startDate, LocalDate endDate) {
        return healthDataRepository.findAverageHeartRateByUserIdAndDateBetween(userId, startDate, endDate);
    }

    /**
     * Get average sleep duration for a user between dates
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return the average sleep duration in minutes, or null if no sleep durations are available
     */
    public Double getAverageSleepDuration(Long userId, LocalDate startDate, LocalDate endDate) {
        return healthDataRepository.findAverageSleepDurationByUserIdAndDateBetween(userId, startDate, endDate);
    }

    /**
     * Sync health data from external source
     * @param userId the user ID
     * @param healthDataList the list of health data to sync
     * @return the list of synced health data
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public List<HealthData> syncHealthData(Long userId, List<HealthData> healthDataList) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        for (HealthData healthData : healthDataList) {
            healthData.setUser(user);
            healthData.setSyncStatus("SYNCED");
            
            // Check if health data already exists for this date
            Optional<HealthData> existingData = healthDataRepository.findByUserAndDate(user, healthData.getDate());
            
            if (existingData.isPresent()) {
                // Update existing health data with new values
                HealthData existing = existingData.get();
                
                // Update fields if provided in the new data
                if (healthData.getStepCount() != null) {
                    existing.setStepCount(healthData.getStepCount());
                }
                if (healthData.getHeartRateAvg() != null) {
                    existing.setHeartRateAvg(healthData.getHeartRateAvg());
                }
                // ... update other fields as needed
                
                healthData = existing; // Use the existing entity with updated values
            }
        }
        
        return healthDataRepository.saveAll(healthDataList);
    }
}