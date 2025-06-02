package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.HealthDataRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HealthDataServiceTest {

    @Mock
    private HealthDataRepository healthDataRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HealthDataService healthDataService;

    private User testUser;
    private HealthData testHealthData;
    private LocalDate today;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        today = LocalDate.now();
        now = LocalDateTime.now();
        
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();

        testHealthData = HealthData.builder()
                .id(1L)
                .date(today)
                .stepCount(8500)
                .heartRateAvg(72)
                .heartRateMin(60)
                .heartRateMax(110)
                .sleepDurationMinutes(420)
                .deepSleepMinutes(120)
                .lightSleepMinutes(240)
                .remSleepMinutes(60)
                .caloriesBurned(2100)
                .exerciseDurationMinutes(45)
                .exerciseType("Running")
                .dataSource("Samsung Health")
                .syncStatus("SYNCED")
                .createdAt(now)
                .updatedAt(now)
                .user(testUser)
                .build();
    }

    @Test
    void findAllByUser_ShouldReturnAllHealthDataForUser() {
        // Given
        List<HealthData> expectedData = Arrays.asList(testHealthData, new HealthData());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUser(testUser)).thenReturn(expectedData);

        // When
        List<HealthData> actualData = healthDataService.findAllByUser(1L);

        // Then
        assertEquals(expectedData.size(), actualData.size());
        assertEquals(expectedData, actualData);
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUser(testUser);
    }

    @Test
    void findAllByUser_WithPagination_ShouldReturnPageOfHealthData() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<HealthData> data = Arrays.asList(testHealthData);
        Page<HealthData> expectedPage = new PageImpl<>(data, pageable, data.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUser(testUser, pageable)).thenReturn(expectedPage);

        // When
        Page<HealthData> actualPage = healthDataService.findAllByUser(1L, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), actualPage.getTotalElements());
        assertEquals(expectedPage.getContent(), actualPage.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUser(testUser, pageable);
    }

    @Test
    void findById_WithExistingId_ShouldReturnHealthData() {
        // Given
        when(healthDataRepository.findById(1L)).thenReturn(Optional.of(testHealthData));

        // When
        Optional<HealthData> result = healthDataService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testHealthData, result.get());
        verify(healthDataRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // Given
        when(healthDataRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<HealthData> result = healthDataService.findById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(healthDataRepository, times(1)).findById(99L);
    }

    @Test
    void findByUserAndDate_WithExistingData_ShouldReturnHealthData() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUserAndDate(testUser, today)).thenReturn(Optional.of(testHealthData));

        // When
        Optional<HealthData> result = healthDataService.findByUserAndDate(1L, today);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testHealthData, result.get());
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUserAndDate(testUser, today);
    }

    @Test
    void findByUserAndDateRange_ShouldReturnHealthDataList() {
        // Given
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;
        List<HealthData> expectedData = Arrays.asList(testHealthData);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUserAndDateBetweenOrderByDateAsc(testUser, startDate, endDate)).thenReturn(expectedData);

        // When
        List<HealthData> result = healthDataService.findByUserAndDateRange(1L, startDate, endDate);

        // Then
        assertEquals(expectedData.size(), result.size());
        assertEquals(expectedData, result);
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUserAndDateBetweenOrderByDateAsc(testUser, startDate, endDate);
    }

    @Test
    void createOrUpdateHealthData_WithNewData_ShouldCreateHealthData() {
        // Given
        HealthData newHealthData = HealthData.builder()
                .date(today)
                .stepCount(10000)
                .heartRateAvg(75)
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUserAndDate(testUser, today)).thenReturn(Optional.empty());
        when(healthDataRepository.save(any(HealthData.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        HealthData result = healthDataService.createOrUpdateHealthData(1L, newHealthData);

        // Then
        assertNotNull(result);
        assertEquals(today, result.getDate());
        assertEquals(10000, result.getStepCount());
        assertEquals(75, result.getHeartRateAvg());
        assertEquals(testUser, result.getUser());
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUserAndDate(testUser, today);
        verify(healthDataRepository, times(1)).save(any(HealthData.class));
    }

    @Test
    void createOrUpdateHealthData_WithExistingData_ShouldUpdateHealthData() {
        // Given
        HealthData updatedData = HealthData.builder()
                .date(today)
                .stepCount(12000)
                .heartRateAvg(78)
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUserAndDate(testUser, today)).thenReturn(Optional.of(testHealthData));
        when(healthDataRepository.save(any(HealthData.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        HealthData result = healthDataService.createOrUpdateHealthData(1L, updatedData);

        // Then
        assertNotNull(result);
        assertEquals(today, result.getDate());
        assertEquals(12000, result.getStepCount());
        assertEquals(78, result.getHeartRateAvg());
        // Original values that weren't updated should remain
        assertEquals(60, result.getHeartRateMin());
        assertEquals(110, result.getHeartRateMax());
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(1)).findByUserAndDate(testUser, today);
        verify(healthDataRepository, times(1)).save(any(HealthData.class));
    }

    @Test
    void deleteHealthData_WithExistingId_ShouldDeleteHealthData() {
        // Given
        when(healthDataRepository.existsById(1L)).thenReturn(true);
        doNothing().when(healthDataRepository).deleteById(1L);

        // When
        healthDataService.deleteHealthData(1L);

        // Then
        verify(healthDataRepository, times(1)).existsById(1L);
        verify(healthDataRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteHealthData_WithNonExistingId_ShouldThrowException() {
        // Given
        when(healthDataRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            healthDataService.deleteHealthData(99L);
        });
        
        assertEquals("Health data not found with id: 99", exception.getMessage());
        verify(healthDataRepository, times(1)).existsById(99L);
        verify(healthDataRepository, never()).deleteById(anyLong());
    }

    @Test
    void getAverageStepCount_ShouldReturnAverageStepCount() {
        // Given
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;
        Double expectedAverage = 9500.0;
        
        when(healthDataRepository.findAverageStepCountByUserIdAndDateBetween(1L, startDate, endDate)).thenReturn(expectedAverage);

        // When
        Double result = healthDataService.getAverageStepCount(1L, startDate, endDate);

        // Then
        assertEquals(expectedAverage, result);
        verify(healthDataRepository, times(1)).findAverageStepCountByUserIdAndDateBetween(1L, startDate, endDate);
    }

    @Test
    void getAverageHeartRate_ShouldReturnAverageHeartRate() {
        // Given
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;
        Double expectedAverage = 72.5;
        
        when(healthDataRepository.findAverageHeartRateByUserIdAndDateBetween(1L, startDate, endDate)).thenReturn(expectedAverage);

        // When
        Double result = healthDataService.getAverageHeartRate(1L, startDate, endDate);

        // Then
        assertEquals(expectedAverage, result);
        verify(healthDataRepository, times(1)).findAverageHeartRateByUserIdAndDateBetween(1L, startDate, endDate);
    }

    @Test
    void getAverageSleepDuration_ShouldReturnAverageSleepDuration() {
        // Given
        LocalDate startDate = today.minusDays(7);
        LocalDate endDate = today;
        Double expectedAverage = 430.0;
        
        when(healthDataRepository.findAverageSleepDurationByUserIdAndDateBetween(1L, startDate, endDate)).thenReturn(expectedAverage);

        // When
        Double result = healthDataService.getAverageSleepDuration(1L, startDate, endDate);

        // Then
        assertEquals(expectedAverage, result);
        verify(healthDataRepository, times(1)).findAverageSleepDurationByUserIdAndDateBetween(1L, startDate, endDate);
    }

    @Test
    void syncHealthData_ShouldSyncAndReturnHealthDataList() {
        // Given
        List<HealthData> healthDataList = Arrays.asList(
            HealthData.builder().date(today).stepCount(10000).build(),
            HealthData.builder().date(today.minusDays(1)).stepCount(9000).build()
        );
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(healthDataRepository.findByUserAndDate(eq(testUser), any(LocalDate.class))).thenReturn(Optional.empty());
        when(healthDataRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        List<HealthData> result = healthDataService.syncHealthData(1L, healthDataList);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testUser, result.get(0).getUser());
        assertEquals("SYNCED", result.get(0).getSyncStatus());
        assertEquals(testUser, result.get(1).getUser());
        assertEquals("SYNCED", result.get(1).getSyncStatus());
        verify(userRepository, times(1)).findById(1L);
        verify(healthDataRepository, times(2)).findByUserAndDate(eq(testUser), any(LocalDate.class));
        verify(healthDataRepository, times(1)).saveAll(anyList());
    }
}