package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DiaryEntryServiceTest {

    @Mock
    private DiaryEntryRepository diaryEntryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DiaryEntryService diaryEntryService;

    private User testUser;
    private DiaryEntry testDiaryEntry;
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
                .moodScore(8)
                .energyLevel(7)
                .stressLevel(3)
                .sleepHours(7.5f)
                .isPrivate(true)
                .createdAt(now)
                .updatedAt(now)
                .user(testUser)
                .build();
    }

    @Test
    void findAllByUser_ShouldReturnAllDiaryEntriesForUser() {
        // Given
        List<DiaryEntry> expectedEntries = Arrays.asList(testDiaryEntry, new DiaryEntry());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(diaryEntryRepository.findByUser(testUser)).thenReturn(expectedEntries);

        // When
        List<DiaryEntry> actualEntries = diaryEntryService.findAllByUser(1L);

        // Then
        assertEquals(expectedEntries.size(), actualEntries.size());
        assertEquals(expectedEntries, actualEntries);
        verify(userRepository, times(1)).findById(1L);
        verify(diaryEntryRepository, times(1)).findByUser(testUser);
    }

    @Test
    void findAllByUser_WithPagination_ShouldReturnPageOfDiaryEntries() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<DiaryEntry> entries = Arrays.asList(testDiaryEntry);
        Page<DiaryEntry> expectedPage = new PageImpl<>(entries, pageable, entries.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(diaryEntryRepository.findByUser(testUser, pageable)).thenReturn(expectedPage);

        // When
        Page<DiaryEntry> actualPage = diaryEntryService.findAllByUser(1L, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), actualPage.getTotalElements());
        assertEquals(expectedPage.getContent(), actualPage.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(diaryEntryRepository, times(1)).findByUser(testUser, pageable);
    }

    @Test
    void findById_WithExistingId_ShouldReturnDiaryEntry() {
        // Given
        when(diaryEntryRepository.findById(1L)).thenReturn(Optional.of(testDiaryEntry));

        // When
        Optional<DiaryEntry> result = diaryEntryService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testDiaryEntry, result.get());
        verify(diaryEntryRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // Given
        when(diaryEntryRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<DiaryEntry> result = diaryEntryService.findById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(diaryEntryRepository, times(1)).findById(99L);
    }

    @Test
    void createDiaryEntry_WithValidData_ShouldReturnCreatedEntry() {
        // Given
        DiaryEntry newEntry = DiaryEntry.builder()
                .title("New Diary Entry")
                .content("This is a new diary entry content.")
                .moodScore(9)
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(diaryEntryRepository.save(any(DiaryEntry.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        DiaryEntry result = diaryEntryService.createDiaryEntry(1L, newEntry);

        // Then
        assertNotNull(result);
        assertEquals("New Diary Entry", result.getTitle());
        assertEquals("This is a new diary entry content.", result.getContent());
        assertEquals(9, result.getMoodScore());
        assertEquals(testUser, result.getUser());
        verify(userRepository, times(1)).findById(1L);
        verify(diaryEntryRepository, times(1)).save(any(DiaryEntry.class));
    }

    @Test
    void createDiaryEntry_WithNonExistingUser_ShouldThrowException() {
        // Given
        DiaryEntry newEntry = DiaryEntry.builder()
                .title("New Diary Entry")
                .content("This is a new diary entry content.")
                .build();
        
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            diaryEntryService.createDiaryEntry(99L, newEntry);
        });
        
        assertEquals("User not found with id: 99", exception.getMessage());
        verify(userRepository, times(1)).findById(99L);
        verify(diaryEntryRepository, never()).save(any(DiaryEntry.class));
    }

    @Test
    void updateDiaryEntry_WithValidData_ShouldReturnUpdatedEntry() {
        // Given
        DiaryEntry updatedDetails = DiaryEntry.builder()
                .title("Updated Title")
                .content("Updated content")
                .moodScore(10)
                .energyLevel(9)
                .stressLevel(2)
                .sleepHours(8.0f)
                .isPrivate(false)
                .build();
        
        when(diaryEntryRepository.findById(1L)).thenReturn(Optional.of(testDiaryEntry));
        when(diaryEntryRepository.save(any(DiaryEntry.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        DiaryEntry result = diaryEntryService.updateDiaryEntry(1L, updatedDetails);

        // Then
        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated content", result.getContent());
        assertEquals(10, result.getMoodScore());
        assertEquals(9, result.getEnergyLevel());
        assertEquals(2, result.getStressLevel());
        assertEquals(8.0f, result.getSleepHours());
        assertFalse(result.isPrivate());
        verify(diaryEntryRepository, times(1)).findById(1L);
        verify(diaryEntryRepository, times(1)).save(any(DiaryEntry.class));
    }

    @Test
    void updateDiaryEntry_WithNonExistingId_ShouldThrowException() {
        // Given
        DiaryEntry updatedDetails = DiaryEntry.builder()
                .title("Updated Title")
                .content("Updated content")
                .build();
        
        when(diaryEntryRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            diaryEntryService.updateDiaryEntry(99L, updatedDetails);
        });
        
        assertEquals("Diary entry not found with id: 99", exception.getMessage());
        verify(diaryEntryRepository, times(1)).findById(99L);
        verify(diaryEntryRepository, never()).save(any(DiaryEntry.class));
    }

    @Test
    void deleteDiaryEntry_WithExistingId_ShouldDeleteEntry() {
        // Given
        when(diaryEntryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(diaryEntryRepository).deleteById(1L);

        // When
        diaryEntryService.deleteDiaryEntry(1L);

        // Then
        verify(diaryEntryRepository, times(1)).existsById(1L);
        verify(diaryEntryRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteDiaryEntry_WithNonExistingId_ShouldThrowException() {
        // Given
        when(diaryEntryRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            diaryEntryService.deleteDiaryEntry(99L);
        });
        
        assertEquals("Diary entry not found with id: 99", exception.getMessage());
        verify(diaryEntryRepository, times(1)).existsById(99L);
        verify(diaryEntryRepository, never()).deleteById(anyLong());
    }

    @Test
    void getAverageMoodScore_ShouldReturnAverageMoodScore() {
        // Given
        Double expectedAverage = 7.5;
        when(diaryEntryRepository.findAverageMoodScoreByUserId(1L)).thenReturn(expectedAverage);

        // When
        Double result = diaryEntryService.getAverageMoodScore(1L);

        // Then
        assertEquals(expectedAverage, result);
        verify(diaryEntryRepository, times(1)).findAverageMoodScoreByUserId(1L);
    }
}