package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RecommendationRepository;
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
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private User testUser;
    private Recommendation testRecommendation;
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

        testRecommendation = Recommendation.builder()
                .id(1L)
                .title("Exercise Recommendation")
                .content("Try to exercise for at least 30 minutes every day.")
                .category("Health")
                .priorityLevel(2)
                .isRead(false)
                .isFavorite(false)
                .source("ChatGPT")
                .sourcePrompt("What are some good exercise habits?")
                .sourceResponse("Regular exercise is important for maintaining good health...")
                .createdAt(now)
                .updatedAt(now)
                .user(testUser)
                .build();
    }

    @Test
    void findAllByUser_ShouldReturnAllRecommendationsForUser() {
        // Given
        List<Recommendation> expectedRecommendations = Arrays.asList(testRecommendation, new Recommendation());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.findByUser(testUser)).thenReturn(expectedRecommendations);

        // When
        List<Recommendation> actualRecommendations = recommendationService.findAllByUser(1L);

        // Then
        assertEquals(expectedRecommendations.size(), actualRecommendations.size());
        assertEquals(expectedRecommendations, actualRecommendations);
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).findByUser(testUser);
    }

    @Test
    void findAllByUser_WithPagination_ShouldReturnPageOfRecommendations() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Recommendation> recommendations = Arrays.asList(testRecommendation);
        Page<Recommendation> expectedPage = new PageImpl<>(recommendations, pageable, recommendations.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.findByUser(testUser, pageable)).thenReturn(expectedPage);

        // When
        Page<Recommendation> actualPage = recommendationService.findAllByUser(1L, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), actualPage.getTotalElements());
        assertEquals(expectedPage.getContent(), actualPage.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).findByUser(testUser, pageable);
    }

    @Test
    void findById_WithExistingId_ShouldReturnRecommendation() {
        // Given
        when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));

        // When
        Optional<Recommendation> result = recommendationService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testRecommendation, result.get());
        verify(recommendationRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // Given
        when(recommendationRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<Recommendation> result = recommendationService.findById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(recommendationRepository, times(1)).findById(99L);
    }

    @Test
    void findByUserAndReadStatus_ShouldReturnRecommendationsWithSpecifiedReadStatus() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Recommendation> recommendations = Arrays.asList(testRecommendation);
        Page<Recommendation> expectedPage = new PageImpl<>(recommendations, pageable, recommendations.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.findByUserAndIsRead(testUser, false, pageable)).thenReturn(expectedPage);

        // When
        Page<Recommendation> result = recommendationService.findByUserAndReadStatus(1L, false, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), result.getTotalElements());
        assertEquals(expectedPage.getContent(), result.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).findByUserAndIsRead(testUser, false, pageable);
    }

    @Test
    void findByUserAndFavoriteStatus_ShouldReturnRecommendationsWithSpecifiedFavoriteStatus() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Recommendation> recommendations = Arrays.asList(testRecommendation);
        Page<Recommendation> expectedPage = new PageImpl<>(recommendations, pageable, recommendations.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.findByUserAndIsFavorite(testUser, false, pageable)).thenReturn(expectedPage);

        // When
        Page<Recommendation> result = recommendationService.findByUserAndFavoriteStatus(1L, false, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), result.getTotalElements());
        assertEquals(expectedPage.getContent(), result.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).findByUserAndIsFavorite(testUser, false, pageable);
    }

    @Test
    void createRecommendation_WithValidData_ShouldReturnCreatedRecommendation() {
        // Given
        Recommendation newRecommendation = Recommendation.builder()
                .title("Nutrition Recommendation")
                .content("Include more fruits and vegetables in your diet.")
                .category("Nutrition")
                .priorityLevel(1)
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Recommendation result = recommendationService.createRecommendation(1L, newRecommendation);

        // Then
        assertNotNull(result);
        assertEquals("Nutrition Recommendation", result.getTitle());
        assertEquals("Include more fruits and vegetables in your diet.", result.getContent());
        assertEquals("Nutrition", result.getCategory());
        assertEquals(1, result.getPriorityLevel());
        assertEquals(testUser, result.getUser());
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void createRecommendation_WithNonExistingUser_ShouldThrowException() {
        // Given
        Recommendation newRecommendation = Recommendation.builder()
                .title("Nutrition Recommendation")
                .content("Include more fruits and vegetables in your diet.")
                .build();
        
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            recommendationService.createRecommendation(99L, newRecommendation);
        });
        
        assertEquals("User not found with id: 99", exception.getMessage());
        verify(userRepository, times(1)).findById(99L);
        verify(recommendationRepository, never()).save(any(Recommendation.class));
    }

    @Test
    void updateRecommendation_WithValidData_ShouldReturnUpdatedRecommendation() {
        // Given
        Recommendation updatedDetails = Recommendation.builder()
                .title("Updated Exercise Recommendation")
                .content("Exercise for at least 45 minutes every day.")
                .category("Fitness")
                .priorityLevel(3)
                .source("Updated Source")
                .sourcePrompt("Updated prompt")
                .sourceResponse("Updated response")
                .build();
        
        when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Recommendation result = recommendationService.updateRecommendation(1L, updatedDetails);

        // Then
        assertNotNull(result);
        assertEquals("Updated Exercise Recommendation", result.getTitle());
        assertEquals("Exercise for at least 45 minutes every day.", result.getContent());
        assertEquals("Fitness", result.getCategory());
        assertEquals(3, result.getPriorityLevel());
        assertEquals("Updated Source", result.getSource());
        assertEquals("Updated prompt", result.getSourcePrompt());
        assertEquals("Updated response", result.getSourceResponse());
        verify(recommendationRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void markAsRead_ShouldUpdateReadStatus() {
        // Given
        when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Recommendation result = recommendationService.markAsRead(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.isRead());
        verify(recommendationRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void markAsUnread_ShouldUpdateReadStatus() {
        // Given
        testRecommendation.setRead(true);
        when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Recommendation result = recommendationService.markAsUnread(1L);

        // Then
        assertNotNull(result);
        assertFalse(result.isRead());
        verify(recommendationRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void toggleFavorite_ShouldToggleFavoriteStatus() {
        // Given
        when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Recommendation result = recommendationService.toggleFavorite(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.isFavorite()); // Should toggle from false to true
        verify(recommendationRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void deleteRecommendation_WithExistingId_ShouldDeleteRecommendation() {
        // Given
        when(recommendationRepository.existsById(1L)).thenReturn(true);
        doNothing().when(recommendationRepository).deleteById(1L);

        // When
        recommendationService.deleteRecommendation(1L);

        // Then
        verify(recommendationRepository, times(1)).existsById(1L);
        verify(recommendationRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteRecommendation_WithNonExistingId_ShouldThrowException() {
        // Given
        when(recommendationRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            recommendationService.deleteRecommendation(99L);
        });
        
        assertEquals("Recommendation not found with id: 99", exception.getMessage());
        verify(recommendationRepository, times(1)).existsById(99L);
        verify(recommendationRepository, never()).deleteById(anyLong());
    }

    @Test
    void countUnreadByUser_ShouldReturnUnreadCount() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.countByUserAndIsReadFalse(testUser)).thenReturn(5L);

        // When
        long result = recommendationService.countUnreadByUser(1L);

        // Then
        assertEquals(5L, result);
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).countByUserAndIsReadFalse(testUser);
    }

    @Test
    void getMostCommonCategories_ShouldReturnCategoryCounts() {
        // Given
        List<Object[]> mockResults = Arrays.asList(
            new Object[]{"Health", 5L},
            new Object[]{"Nutrition", 3L},
            new Object[]{"Fitness", 2L}
        );
        
        when(recommendationRepository.findMostCommonCategoriesByUserId(1L)).thenReturn(mockResults);

        // When
        Map<String, Long> result = recommendationService.getMostCommonCategories(1L);

        // Then
        assertEquals(3, result.size());
        assertEquals(5L, result.get("Health"));
        assertEquals(3L, result.get("Nutrition"));
        assertEquals(2L, result.get("Fitness"));
        verify(recommendationRepository, times(1)).findMostCommonCategoriesByUserId(1L);
    }

    @Test
    void createRecommendations_WithValidData_ShouldReturnCreatedRecommendations() {
        // Given
        List<Recommendation> newRecommendations = Arrays.asList(
            Recommendation.builder().title("Rec 1").content("Content 1").build(),
            Recommendation.builder().title("Rec 2").content("Content 2").build()
        );
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recommendationRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        List<Recommendation> result = recommendationService.createRecommendations(1L, newRecommendations);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testUser, result.get(0).getUser());
        assertEquals(testUser, result.get(1).getUser());
        verify(userRepository, times(1)).findById(1L);
        verify(recommendationRepository, times(1)).saveAll(anyList());
    }
}