package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.Emotion;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
import com.example.senti_mate_back_end.repository.EmotionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmotionServiceTest {

    @Mock
    private EmotionRepository emotionRepository;

    @Mock
    private DiaryEntryRepository diaryEntryRepository;

    @InjectMocks
    private EmotionService emotionService;

    private User testUser;
    private DiaryEntry testDiaryEntry;
    private Emotion testEmotion;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();

        testDiaryEntry = DiaryEntry.builder()
                .id(1L)
                .title("Test Diary Entry")
                .content("This is a test diary entry content.")
                .user(testUser)
                .build();

        testEmotion = Emotion.builder()
                .id(1L)
                .name("Happy")
                .intensity(8)
                .description("Feeling joyful and content")
                .colorCode("#FFD700")
                .createdAt(now)
                .diaryEntry(testDiaryEntry)
                .build();
    }

    @Test
    void findByDiaryEntry_ShouldReturnAllEmotionsForDiaryEntry() {
        // Given
        List<Emotion> expectedEmotions = Arrays.asList(testEmotion, new Emotion());
        when(diaryEntryRepository.findById(1L)).thenReturn(Optional.of(testDiaryEntry));
        when(emotionRepository.findByDiaryEntry(testDiaryEntry)).thenReturn(expectedEmotions);

        // When
        List<Emotion> actualEmotions = emotionService.findByDiaryEntry(1L);

        // Then
        assertEquals(expectedEmotions.size(), actualEmotions.size());
        assertEquals(expectedEmotions, actualEmotions);
        verify(diaryEntryRepository, times(1)).findById(1L);
        verify(emotionRepository, times(1)).findByDiaryEntry(testDiaryEntry);
    }

    @Test
    void findByDiaryEntry_WithNonExistingDiaryEntry_ShouldThrowException() {
        // Given
        when(diaryEntryRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            emotionService.findByDiaryEntry(99L);
        });
        
        assertEquals("Diary entry not found with id: 99", exception.getMessage());
        verify(diaryEntryRepository, times(1)).findById(99L);
        verify(emotionRepository, never()).findByDiaryEntry(any(DiaryEntry.class));
    }

    @Test
    void findById_WithExistingId_ShouldReturnEmotion() {
        // Given
        when(emotionRepository.findById(1L)).thenReturn(Optional.of(testEmotion));

        // When
        Optional<Emotion> result = emotionService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testEmotion, result.get());
        verify(emotionRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // Given
        when(emotionRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Emotion> result = emotionService.findById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(emotionRepository, times(1)).findById(99L);
    }

    @Test
    void createEmotion_WithValidData_ShouldReturnCreatedEmotion() {
        // Given
        Emotion newEmotion = Emotion.builder()
                .name("Excited")
                .intensity(9)
                .description("Feeling enthusiastic and eager")
                .colorCode("#FF4500")
                .build();
        
        when(diaryEntryRepository.findById(1L)).thenReturn(Optional.of(testDiaryEntry));
        when(emotionRepository.save(any(Emotion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Emotion result = emotionService.createEmotion(1L, newEmotion);

        // Then
        assertNotNull(result);
        assertEquals("Excited", result.getName());
        assertEquals(9, result.getIntensity());
        assertEquals("Feeling enthusiastic and eager", result.getDescription());
        assertEquals("#FF4500", result.getColorCode());
        assertEquals(testDiaryEntry, result.getDiaryEntry());
        verify(diaryEntryRepository, times(1)).findById(1L);
        verify(emotionRepository, times(1)).save(any(Emotion.class));
    }

    @Test
    void createEmotion_WithNonExistingDiaryEntry_ShouldThrowException() {
        // Given
        Emotion newEmotion = Emotion.builder()
                .name("Excited")
                .intensity(9)
                .build();
        
        when(diaryEntryRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            emotionService.createEmotion(99L, newEmotion);
        });
        
        assertEquals("Diary entry not found with id: 99", exception.getMessage());
        verify(diaryEntryRepository, times(1)).findById(99L);
        verify(emotionRepository, never()).save(any(Emotion.class));
    }

    @Test
    void updateEmotion_WithValidData_ShouldReturnUpdatedEmotion() {
        // Given
        Emotion updatedDetails = Emotion.builder()
                .name("Calm")
                .intensity(5)
                .description("Feeling peaceful and relaxed")
                .colorCode("#87CEEB")
                .build();
        
        when(emotionRepository.findById(1L)).thenReturn(Optional.of(testEmotion));
        when(emotionRepository.save(any(Emotion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Emotion result = emotionService.updateEmotion(1L, updatedDetails);

        // Then
        assertNotNull(result);
        assertEquals("Calm", result.getName());
        assertEquals(5, result.getIntensity());
        assertEquals("Feeling peaceful and relaxed", result.getDescription());
        assertEquals("#87CEEB", result.getColorCode());
        verify(emotionRepository, times(1)).findById(1L);
        verify(emotionRepository, times(1)).save(any(Emotion.class));
    }

    @Test
    void updateEmotion_WithNonExistingId_ShouldThrowException() {
        // Given
        Emotion updatedDetails = Emotion.builder()
                .name("Calm")
                .intensity(5)
                .build();
        
        when(emotionRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            emotionService.updateEmotion(99L, updatedDetails);
        });
        
        assertEquals("Emotion not found with id: 99", exception.getMessage());
        verify(emotionRepository, times(1)).findById(99L);
        verify(emotionRepository, never()).save(any(Emotion.class));
    }

    @Test
    void deleteEmotion_WithExistingId_ShouldDeleteEmotion() {
        // Given
        when(emotionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(emotionRepository).deleteById(1L);

        // When
        emotionService.deleteEmotion(1L);

        // Then
        verify(emotionRepository, times(1)).existsById(1L);
        verify(emotionRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteEmotion_WithNonExistingId_ShouldThrowException() {
        // Given
        when(emotionRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            emotionService.deleteEmotion(99L);
        });
        
        assertEquals("Emotion not found with id: 99", exception.getMessage());
        verify(emotionRepository, times(1)).existsById(99L);
        verify(emotionRepository, never()).deleteById(anyLong());
    }

    @Test
    void getMostCommonEmotions_ShouldReturnEmotionCounts() {
        // Given
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{"Happy", 5L},
            new Object[]{"Sad", 3L},
            new Object[]{"Angry", 2L}
        );
        
        when(emotionRepository.findMostCommonEmotionsByUserId(1L, 3)).thenReturn(mockResults);

        // When
        Map<String, Long> result = emotionService.getMostCommonEmotions(1L, 3);

        // Then
        assertEquals(3, result.size());
        assertEquals(5L, result.get("Happy"));
        assertEquals(3L, result.get("Sad"));
        assertEquals(2L, result.get("Angry"));
        verify(emotionRepository, times(1)).findMostCommonEmotionsByUserId(1L, 3);
    }

    @Test
    void getAverageIntensityByEmotion_ShouldReturnEmotionIntensities() {
        // Given
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{"Happy", 7.5},
            new Object[]{"Sad", 6.2},
            new Object[]{"Angry", 8.1}
        );
        
        when(emotionRepository.findAverageIntensityByEmotionForUserId(1L)).thenReturn(mockResults);

        // When
        Map<String, Double> result = emotionService.getAverageIntensityByEmotion(1L);

        // Then
        assertEquals(3, result.size());
        assertEquals(7.5, result.get("Happy"));
        assertEquals(6.2, result.get("Sad"));
        assertEquals(8.1, result.get("Angry"));
        verify(emotionRepository, times(1)).findAverageIntensityByEmotionForUserId(1L);
    }

    @Test
    void createEmotions_WithValidData_ShouldReturnCreatedEmotions() {
        // Given
        List<Emotion> newEmotions = Arrays.asList(
            Emotion.builder().name("Happy").intensity(8).build(),
            Emotion.builder().name("Excited").intensity(9).build()
        );
        
        when(diaryEntryRepository.findById(1L)).thenReturn(Optional.of(testDiaryEntry));
        when(emotionRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        List<Emotion> result = emotionService.createEmotions(1L, newEmotions);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testDiaryEntry, result.get(0).getDiaryEntry());
        assertEquals(testDiaryEntry, result.get(1).getDiaryEntry());
        verify(diaryEntryRepository, times(1)).findById(1L);
        verify(emotionRepository, times(1)).saveAll(anyList());
    }
}