package com.example.senti_mate_back_end.controller.v1;

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

@WebMvcTest(EmotionControllerV1.class)
public class EmotionControllerV1Test {

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
        mockMvc.perform(get("/api/v1/emotions/diary/1"))
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
        mockMvc.perform(get("/api/v1/emotions/1"))
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
        mockMvc.perform(get("/api/v1/emotions/99"))
                .andExpect(status().isNotFound());

        verify(emotionService, times(1)).findById(99L);
    }

    @Test
    void getEmotionsByDiaryEntryAndName_ShouldReturnEmotions() throws Exception {
        // Given
        when(emotionService.findByDiaryEntryAndName(1L, "joy")).thenReturn(Collections.singletonList(testEmotion));

        // When & Then
        mockMvc.perform(get("/api/v1/emotions/diary/1/name/joy"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("joy")));

        verify(emotionService, times(1)).findByDiaryEntryAndName(1L, "joy");
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
        mockMvc.perform(post("/api/v1/emotions/diary/1")
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
    void getMostCommonEmotions_WithoutUserId_ShouldReturnEmotionCounts() throws Exception {
        // Given
        Map<String, Long> emotionCounts = new HashMap<>();
        emotionCounts.put("joy", 5L);
        emotionCounts.put("sadness", 3L);

        when(emotionService.getMostCommonEmotions(1L, 5)).thenReturn(emotionCounts);

        // When & Then
        mockMvc.perform(get("/api/v1/emotions/most-common?limit=5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.joy", is(5)))
                .andExpect(jsonPath("$.sadness", is(3)));

        verify(emotionService, times(1)).getMostCommonEmotions(1L, 5);
    }

    @Test
    void analyzeText_ShouldReturnDetectedEmotions() throws Exception {
        // Given
        EmotionControllerV1.TextAnalysisRequest request = new EmotionControllerV1.TextAnalysisRequest();
        request.setText("I am feeling happy and excited today!");

        // When & Then
        mockMvc.perform(post("/api/v1/emotions/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.text", is("I am feeling happy and excited today!")))
                .andExpect(jsonPath("$.emotions", notNullValue()));
    }
}