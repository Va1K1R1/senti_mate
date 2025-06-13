package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.Emotion;
import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.EmotionService;
import com.example.senti_mate_back_end.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.*;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmotionController.class)
public class EmotionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmotionService emotionService;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private Emotion testEmotion;
    private User testUser;
    private DiaryEntry testDiaryEntry;
    private List<Emotion> testEmotions;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testDiaryEntry = DiaryEntry.builder()
                .id(1L)
                .title("Test Diary")
                .content("Test content")
                .user(testUser)
                .build();

        testEmotion = Emotion.builder()
                .id(1L)
                .name("joy")
                .intensity(4)
                .diaryEntry(testDiaryEntry)
                .build();

        Emotion testEmotion2 = Emotion.builder()
                .id(2L)
                .name("sadness")
                .intensity(3)
                .diaryEntry(testDiaryEntry)
                .build();

        testEmotions = Arrays.asList(testEmotion, testEmotion2);

        // Mock the getCurrentUserId method
        when(userService.findAllUsers()).thenReturn(Collections.singletonList(testUser));
    }

    @Test
    void getAllEmotionsByDiaryEntry_ShouldReturnEmotions() throws Exception {
        // Given
        when(emotionService.findByDiaryEntry(1L)).thenReturn(testEmotions);

        // When & Then
        mockMvc.perform(get("/api/emotions/diary/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("joy")))
                .andExpect(jsonPath("$[0].intensity", is(4)));

        verify(emotionService, times(1)).findByDiaryEntry(1L);
    }

    @Test
    void getEmotionById_WithExistingId_ShouldReturnEmotion() throws Exception {
        // Given
        when(emotionService.findById(1L)).thenReturn(Optional.of(testEmotion));

        // When & Then
        mockMvc.perform(get("/api/emotions/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("joy")))
                .andExpect(jsonPath("$.intensity", is(4)));

        verify(emotionService, times(1)).findById(1L);
    }

    @Test
    void getEmotionById_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        // Given
        when(emotionService.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/emotions/99"))
                .andExpect(status().isNotFound());

        verify(emotionService, times(1)).findById(99L);
    }

    @Test
    void getEmotionsByDiaryEntryAndName_ShouldReturnEmotions() throws Exception {
        // Given
        when(emotionService.findByDiaryEntryAndName(1L, "joy")).thenReturn(Collections.singletonList(testEmotion));

        // When & Then
        mockMvc.perform(get("/api/emotions/diary/1/name/joy"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("joy")));

        verify(emotionService, times(1)).findByDiaryEntryAndName(1L, "joy");
    }

    @Test
    void getEmotionsByDiaryEntryAndMinIntensity_ShouldReturnEmotions() throws Exception {
        // Given
        when(emotionService.findByDiaryEntryAndMinIntensity(1L, 3)).thenReturn(testEmotions);

        // When & Then
        mockMvc.perform(get("/api/emotions/diary/1/intensity/3"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));

        verify(emotionService, times(1)).findByDiaryEntryAndMinIntensity(1L, 3);
    }

    @Test
    void createEmotion_WithValidEmotion_ShouldReturnCreatedEmotion() throws Exception {
        // Given
        Emotion newEmotion = Emotion.builder()
                .name("happiness")
                .intensity(5)
                .build();

        Emotion createdEmotion = Emotion.builder()
                .id(3L)
                .name("happiness")
                .intensity(5)
                .diaryEntry(testDiaryEntry)
                .build();

        when(emotionService.createEmotion(eq(1L), any(Emotion.class))).thenReturn(createdEmotion);

        // When & Then
        mockMvc.perform(post("/api/emotions/diary/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEmotion)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("happiness")))
                .andExpect(jsonPath("$.intensity", is(5)));

        verify(emotionService, times(1)).createEmotion(eq(1L), any(Emotion.class));
    }

    @Test
    void createEmotions_WithValidEmotions_ShouldReturnCreatedEmotions() throws Exception {
        // Given
        List<Emotion> newEmotions = Arrays.asList(
                Emotion.builder().name("happiness").intensity(5).build(),
                Emotion.builder().name("excitement").intensity(4).build()
        );

        List<Emotion> createdEmotions = Arrays.asList(
                Emotion.builder().id(3L).name("happiness").intensity(5).diaryEntry(testDiaryEntry).build(),
                Emotion.builder().id(4L).name("excitement").intensity(4).diaryEntry(testDiaryEntry).build()
        );

        when(emotionService.createEmotions(eq(1L), anyList())).thenReturn(createdEmotions);

        // When & Then
        mockMvc.perform(post("/api/emotions/diary/1/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEmotions)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(3)))
                .andExpect(jsonPath("$[0].name", is("happiness")))
                .andExpect(jsonPath("$[1].id", is(4)))
                .andExpect(jsonPath("$[1].name", is("excitement")));

        verify(emotionService, times(1)).createEmotions(eq(1L), anyList());
    }

    @Test
    void updateEmotion_WithValidEmotion_ShouldReturnUpdatedEmotion() throws Exception {
        // Given
        Emotion updatedDetails = Emotion.builder()
                .name("joy")
                .intensity(5)
                .build();

        Emotion updatedEmotion = Emotion.builder()
                .id(1L)
                .name("joy")
                .intensity(5)
                .diaryEntry(testDiaryEntry)
                .build();

        when(emotionService.updateEmotion(eq(1L), any(Emotion.class))).thenReturn(updatedEmotion);

        // When & Then
        mockMvc.perform(put("/api/emotions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("joy")))
                .andExpect(jsonPath("$.intensity", is(5)));

        verify(emotionService, times(1)).updateEmotion(eq(1L), any(Emotion.class));
    }

    @Test
    void deleteEmotion_WithExistingId_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(emotionService).deleteEmotion(1L);

        // When & Then
        mockMvc.perform(delete("/api/emotions/1"))
                .andExpect(status().isNoContent());

        verify(emotionService, times(1)).deleteEmotion(1L);
    }

    @Test
    void countEmotionsByDiaryEntry_ShouldReturnCount() throws Exception {
        // Given
        when(emotionService.countByDiaryEntry(1L)).thenReturn(2L);

        // When & Then
        mockMvc.perform(get("/api/emotions/diary/1/count"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", is(2)));

        verify(emotionService, times(1)).countByDiaryEntry(1L);
    }

    @Test
    void getMostCommonEmotions_WithUserId_ShouldReturnEmotionCounts() throws Exception {
        // Given
        Map<String, Long> emotionCounts = new HashMap<>();
        emotionCounts.put("joy", 5L);
        emotionCounts.put("sadness", 3L);

        when(emotionService.getMostCommonEmotions(1L, 5)).thenReturn(emotionCounts);

        // When & Then
        mockMvc.perform(get("/api/emotions/user/1/most-common?limit=5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.joy", is(5)))
                .andExpect(jsonPath("$.sadness", is(3)));

        verify(emotionService, times(1)).getMostCommonEmotions(1L, 5);
    }

    @Test
    void getMostCommonEmotions_WithoutUserId_ShouldReturnEmotionCounts() throws Exception {
        // Given
        Map<String, Long> emotionCounts = new HashMap<>();
        emotionCounts.put("joy", 5L);
        emotionCounts.put("sadness", 3L);

        when(emotionService.getMostCommonEmotions(1L, 5)).thenReturn(emotionCounts);

        // When & Then
        mockMvc.perform(get("/api/emotions/most-common?limit=5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.joy", is(5)))
                .andExpect(jsonPath("$.sadness", is(3)));

        verify(emotionService, times(1)).getMostCommonEmotions(1L, 5);
    }

    @Test
    void getAverageIntensityByEmotion_ShouldReturnAverageIntensities() throws Exception {
        // Given
        Map<String, Double> averageIntensities = new HashMap<>();
        averageIntensities.put("joy", 4.5);
        averageIntensities.put("sadness", 3.2);

        when(emotionService.getAverageIntensityByEmotion(1L)).thenReturn(averageIntensities);

        // When & Then
        mockMvc.perform(get("/api/emotions/user/1/average-intensity"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.joy", is(4.5)))
                .andExpect(jsonPath("$.sadness", is(3.2)));

        verify(emotionService, times(1)).getAverageIntensityByEmotion(1L);
    }

    @Test
    void analyzeText_ShouldReturnDetectedEmotions() throws Exception {
        // Given
        EmotionController.TextAnalysisRequest request = new EmotionController.TextAnalysisRequest();
        request.setText("I am feeling happy and excited today!");

        // When & Then
        mockMvc.perform(post("/api/emotions/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.text", is("I am feeling happy and excited today!")))
                .andExpect(jsonPath("$.emotions", notNullValue()));
    }

    @Test
    void getEmotionStats_ShouldReturnStats() throws Exception {
        // Given
        Map<String, Long> mostCommonEmotions = new HashMap<>();
        mostCommonEmotions.put("joy", 5L);
        mostCommonEmotions.put("sadness", 3L);

        Map<String, Double> averageIntensities = new HashMap<>();
        averageIntensities.put("joy", 4.5);
        averageIntensities.put("sadness", 3.2);

        when(emotionService.getMostCommonEmotions(eq(1L), anyInt())).thenReturn(mostCommonEmotions);
        when(emotionService.getAverageIntensityByEmotion(1L)).thenReturn(averageIntensities);

        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();

        // When & Then
        mockMvc.perform(get("/api/emotions/stats?startDate=" + startDate + "&endDate=" + endDate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.mostCommonEmotions.joy", is(5)))
                .andExpect(jsonPath("$.averageIntensities.joy", is(4.5)));

        verify(emotionService, times(1)).getMostCommonEmotions(eq(1L), anyInt());
        verify(emotionService, times(1)).getAverageIntensityByEmotion(1L);
    }
}