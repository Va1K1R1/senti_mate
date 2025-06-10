package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.Emotion;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
import com.example.senti_mate_back_end.repository.EmotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing emotion operations
 */
@Service
public class EmotionService {

    private final EmotionRepository emotionRepository;
    private final DiaryEntryRepository diaryEntryRepository;

    @Autowired
    public EmotionService(EmotionRepository emotionRepository, DiaryEntryRepository diaryEntryRepository) {
        this.emotionRepository = emotionRepository;
        this.diaryEntryRepository = diaryEntryRepository;
    }

    /**
     * Find all emotions for a diary entry
     * @param diaryEntryId the diary entry ID
     * @return list of emotions
     * @throws IllegalArgumentException if the diary entry is not found
     */
    public List<Emotion> findByDiaryEntry(Long diaryEntryId) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        return emotionRepository.findByDiaryEntry(diaryEntry);
    }

    /**
     * Find emotion by ID
     * @param id the emotion ID
     * @return an Optional containing the emotion if found, or empty if not found
     */
    public Optional<Emotion> findById(Long id) {
        return emotionRepository.findById(id);
    }

    /**
     * Find emotions by name for a diary entry
     * @param diaryEntryId the diary entry ID
     * @param name the emotion name
     * @return list of emotions
     * @throws IllegalArgumentException if the diary entry is not found
     */
    public List<Emotion> findByDiaryEntryAndName(Long diaryEntryId, String name) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        return emotionRepository.findByDiaryEntryAndName(diaryEntry, name);
    }

    /**
     * Find emotions by minimum intensity for a diary entry
     * @param diaryEntryId the diary entry ID
     * @param minIntensity the minimum intensity
     * @return list of emotions
     * @throws IllegalArgumentException if the diary entry is not found
     */
    public List<Emotion> findByDiaryEntryAndMinIntensity(Long diaryEntryId, Integer minIntensity) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        return emotionRepository.findByDiaryEntryAndIntensityGreaterThanEqual(diaryEntry, minIntensity);
    }

    /**
     * Create a new emotion for a diary entry
     * @param diaryEntryId the diary entry ID
     * @param emotion the emotion to create
     * @return the created emotion
     * @throws IllegalArgumentException if the diary entry is not found
     */
    @Transactional
    public Emotion createEmotion(Long diaryEntryId, Emotion emotion) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        
        emotion.setDiaryEntry(diaryEntry);
        return emotionRepository.save(emotion);
    }

    /**
     * Update an existing emotion
     * @param id the emotion ID
     * @param emotionDetails the updated emotion details
     * @return the updated emotion
     * @throws IllegalArgumentException if the emotion is not found
     */
    @Transactional
    public Emotion updateEmotion(Long id, Emotion emotionDetails) {
        Emotion emotion = emotionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Emotion not found with id: " + id));
        
        // Update emotion fields
        emotion.setName(emotionDetails.getName());
        emotion.setIntensity(emotionDetails.getIntensity());
        emotion.setDescription(emotionDetails.getDescription());
        emotion.setColorCode(emotionDetails.getColorCode());
        
        return emotionRepository.save(emotion);
    }

    /**
     * Delete an emotion
     * @param id the emotion ID
     * @throws IllegalArgumentException if the emotion is not found
     */
    @Transactional
    public void deleteEmotion(Long id) {
        if (!emotionRepository.existsById(id)) {
            throw new IllegalArgumentException("Emotion not found with id: " + id);
        }
        emotionRepository.deleteById(id);
    }

    /**
     * Count emotions for a diary entry
     * @param diaryEntryId the diary entry ID
     * @return the number of emotions
     * @throws IllegalArgumentException if the diary entry is not found
     */
    public long countByDiaryEntry(Long diaryEntryId) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        return emotionRepository.countByDiaryEntry(diaryEntry);
    }

    /**
     * Get most common emotions for a user
     * @param userId the user ID
     * @param limit the maximum number of results to return
     * @return map of emotion names to their counts, ordered by count descending
     */
    public Map<String, Long> getMostCommonEmotions(Long userId, int limit) {
        List<Object[]> results = emotionRepository.findMostCommonEmotionsByUserId(userId, limit);
        Map<String, Long> emotionCounts = new HashMap<>();
        
        for (Object[] result : results) {
            String emotionName = (String) result[0];
            Long count = ((Number) result[1]).longValue();
            emotionCounts.put(emotionName, count);
        }
        
        return emotionCounts;
    }

    /**
     * Get average intensity by emotion for a user
     * @param userId the user ID
     * @return map of emotion names to their average intensities
     */
    public Map<String, Double> getAverageIntensityByEmotion(Long userId) {
        List<Object[]> results = emotionRepository.findAverageIntensityByEmotionForUserId(userId);
        Map<String, Double> emotionIntensities = new HashMap<>();
        
        for (Object[] result : results) {
            String emotionName = (String) result[0];
            Double avgIntensity = ((Number) result[1]).doubleValue();
            emotionIntensities.put(emotionName, avgIntensity);
        }
        
        return emotionIntensities;
    }

    /**
     * Create multiple emotions for a diary entry
     * @param diaryEntryId the diary entry ID
     * @param emotions the list of emotions to create
     * @return the list of created emotions
     * @throws IllegalArgumentException if the diary entry is not found
     */
    @Transactional
    public List<Emotion> createEmotions(Long diaryEntryId, List<Emotion> emotions) {
        DiaryEntry diaryEntry = diaryEntryRepository.findById(diaryEntryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary entry not found with id: " + diaryEntryId));
        
        emotions.forEach(emotion -> emotion.setDiaryEntry(diaryEntry));
        return emotionRepository.saveAll(emotions);
    }
}