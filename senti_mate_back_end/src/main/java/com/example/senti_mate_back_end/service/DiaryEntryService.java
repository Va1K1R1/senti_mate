package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing diary entry operations
 */
@Service
public class DiaryEntryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final UserRepository userRepository;

    @Autowired
    public DiaryEntryService(DiaryEntryRepository diaryEntryRepository, UserRepository userRepository) {
        this.diaryEntryRepository = diaryEntryRepository;
        this.userRepository = userRepository;
    }

    /**
     * Find all diary entries for a user
     * @param userId the user ID
     * @return list of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public List<DiaryEntry> findAllByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUser(user);
    }

    /**
     * Find all diary entries for a user with pagination
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<DiaryEntry> findAllByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUser(user, pageable);
    }

    /**
     * Find diary entry by ID
     * @param id the diary entry ID
     * @return an Optional containing the diary entry if found, or empty if not found
     */
    public Optional<DiaryEntry> findById(Long id) {
        return diaryEntryRepository.findById(id);
    }

    /**
     * Find diary entries by title containing search term
     * @param userId the user ID
     * @param title the title search term
     * @param pageable pagination information
     * @return page of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<DiaryEntry> findByTitleContaining(Long userId, String title, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUserAndTitleContainingIgnoreCase(user, title, pageable);
    }

    /**
     * Find diary entries by content containing search term
     * @param userId the user ID
     * @param content the content search term
     * @param pageable pagination information
     * @return page of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<DiaryEntry> findByContentContaining(Long userId, String content, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUserAndContentContainingIgnoreCase(user, content, pageable);
    }

    /**
     * Find diary entries by date range
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return page of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<DiaryEntry> findByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUserAndCreatedAtBetween(user, startDate, endDate, pageable);
    }

    /**
     * Find diary entries by mood score range
     * @param userId the user ID
     * @param minScore the minimum mood score
     * @param maxScore the maximum mood score
     * @param pageable pagination information
     * @return page of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<DiaryEntry> findByMoodScoreRange(Long userId, Integer minScore, Integer maxScore, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.findByUserAndMoodScoreBetween(user, minScore, maxScore, pageable);
    }

    /**
     * Create a new diary entry
     * @param userId the user ID
     * @param diaryEntry the diary entry to create
     * @return the created diary entry
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public DiaryEntry createDiaryEntry(Long userId, DiaryEntry diaryEntry) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        diaryEntry.setUser(user);
        return diaryEntryRepository.save(diaryEntry);
    }

    /**
     * Update an existing diary entry
     * @param id the diary entry ID
     * @param diaryEntryDetails the updated diary entry details
     * @return the updated diary entry
     * @throws IllegalArgumentException if the diary entry is not found
     */
    @Transactional
    public DiaryEntry updateDiaryEntry(Long id, DiaryEntry diaryEntryDetails) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + id));
        
        // Update diary entry fields
        diaryEntry.setTitle(diaryEntryDetails.getTitle());
        diaryEntry.setContent(diaryEntryDetails.getContent());
        diaryEntry.setMoodScore(diaryEntryDetails.getMoodScore());
        diaryEntry.setEnergyLevel(diaryEntryDetails.getEnergyLevel());
        diaryEntry.setStressLevel(diaryEntryDetails.getStressLevel());
        diaryEntry.setSleepHours(diaryEntryDetails.getSleepHours());
        diaryEntry.setPrivate(diaryEntryDetails.isPrivate());
        
        return diaryEntryRepository.save(diaryEntry);
    }

    /**
     * Delete a diary entry
     * @param id the diary entry ID
     * @throws IllegalArgumentException if the diary entry is not found
     */
    @Transactional
    public void deleteDiaryEntry(Long id) {
        if (!diaryEntryRepository.existsById(id)) {
            throw new IllegalArgumentException("Diary entry not found with id: " + id);
        }
        diaryEntryRepository.deleteById(id);
    }

    /**
     * Count diary entries for a user
     * @param userId the user ID
     * @return the number of diary entries
     * @throws IllegalArgumentException if the user is not found
     */
    public long countByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return diaryEntryRepository.countByUser(user);
    }

    /**
     * Get average mood score for a user
     * @param userId the user ID
     * @return the average mood score, or null if no mood scores are available
     */
    public Double getAverageMoodScore(Long userId) {
        return diaryEntryRepository.findAverageMoodScoreByUserId(userId);
    }
}