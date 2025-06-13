package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.HealthDataService;
import com.example.senti_mate_back_end.service.SamsungHealthService;
import com.example.senti_mate_back_end.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.*;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HealthDataController.class)
public class HealthDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HealthDataService healthDataService;

    @MockBean
    private SamsungHealthService samsungHealthService;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private HealthData testHealthData;
    private User testUser;
    private List<HealthData> testHealthDataList;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testHealthData = HealthData.builder()
                .id(1L)
                .user(testUser)
                .date(LocalDate.now())
                .stepCount(10000)
                .heartRateAvg(75)
                .sleepDurationMinutes(480)
                .build();

        HealthData testHealthData2 = HealthData.builder()
                .id(2L)
                .user(testUser)
                .date(LocalDate.now().minusDays(1))
                .stepCount(8000)
                .heartRateAvg(72)
                .sleepDurationMinutes(450)
                .build();

        testHealthDataList = Arrays.asList(testHealthData, testHealthData2);

        // Mock the getCurrentUserId method
        when(userService.findAllUsers()).thenReturn(Collections.singletonList(testUser));
    }

    @Test
    void getAllHealthDataByUser_ShouldReturnHealthData() throws Exception {
        // Given
        when(healthDataService.findAllByUser(1L)).thenReturn(testHealthDataList);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)))
                .andExpect(jsonPath("$[0].heartRateAvg", is(75)));

        verify(healthDataService, times(1)).findAllByUser(1L);
    }

    @Test
    void getAllHealthData_ShouldReturnHealthData() throws Exception {
        // Given
        when(healthDataService.findAllByUser(1L)).thenReturn(testHealthDataList);

        // When & Then
        mockMvc.perform(get("/api/health-data"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)));

        verify(healthDataService, times(1)).findAllByUser(1L);
    }

    @Test
    void getPagedHealthDataByUser_ShouldReturnPagedHealthData() throws Exception {
        // Given
        Page<HealthData> pagedResponse = new PageImpl<>(testHealthDataList);
        when(healthDataService.findAllByUser(eq(1L), any(Pageable.class))).thenReturn(pagedResponse);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/paged"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].id", is(1)))
                .andExpect(jsonPath("$.content[0].stepCount", is(10000)));

        verify(healthDataService, times(1)).findAllByUser(eq(1L), any(Pageable.class));
    }

    @Test
    void getHealthDataById_WithExistingId_ShouldReturnHealthData() throws Exception {
        // Given
        when(healthDataService.findById(1L)).thenReturn(Optional.of(testHealthData));

        // When & Then
        mockMvc.perform(get("/api/health-data/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.stepCount", is(10000)))
                .andExpect(jsonPath("$.heartRateAvg", is(75)));

        verify(healthDataService, times(1)).findById(1L);
    }

    @Test
    void getHealthDataById_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        // Given
        when(healthDataService.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/health-data/99"))
                .andExpect(status().isNotFound());

        verify(healthDataService, times(1)).findById(99L);
    }

    @Test
    void getHealthDataByUserAndDate_ShouldReturnHealthData() throws Exception {
        // Given
        LocalDate date = LocalDate.now();
        when(healthDataService.findByUserAndDate(1L, date)).thenReturn(Optional.of(testHealthData));

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/date/" + date))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.stepCount", is(10000)));

        verify(healthDataService, times(1)).findByUserAndDate(1L, date);
    }

    @Test
    void getHealthDataByUserAndDateRange_ShouldReturnHealthData() throws Exception {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(healthDataService.findByUserAndDateRange(1L, startDate, endDate)).thenReturn(testHealthDataList);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/date-range")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)));

        verify(healthDataService, times(1)).findByUserAndDateRange(1L, startDate, endDate);
    }

    @Test
    void getHealthDataByDateRange_ShouldReturnHealthData() throws Exception {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(healthDataService.findByUserAndDateRange(1L, startDate, endDate)).thenReturn(testHealthDataList);

        // When & Then
        mockMvc.perform(get("/api/health-data/date-range")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)));

        verify(healthDataService, times(1)).findByUserAndDateRange(1L, startDate, endDate);
    }

    @Test
    void getHealthDataByUserAndMinStepCount_ShouldReturnHealthData() throws Exception {
        // Given
        when(healthDataService.findByUserAndMinStepCount(1L, 9000)).thenReturn(Collections.singletonList(testHealthData));

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/min-steps/9000"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)));

        verify(healthDataService, times(1)).findByUserAndMinStepCount(1L, 9000);
    }

    @Test
    void createOrUpdateHealthData_WithValidHealthData_ShouldReturnCreatedHealthData() throws Exception {
        // Given
        HealthData newHealthData = HealthData.builder()
                .date(LocalDate.now())
                .stepCount(12000)
                .heartRateAvg(80)
                .sleepDurationMinutes(420)
                .build();

        HealthData createdHealthData = HealthData.builder()
                .id(3L)
                .user(testUser)
                .date(LocalDate.now())
                .stepCount(12000)
                .heartRateAvg(80)
                .sleepDurationMinutes(420)
                .build();

        when(healthDataService.createOrUpdateHealthData(eq(1L), any(HealthData.class))).thenReturn(createdHealthData);

        // When & Then
        mockMvc.perform(post("/api/health-data/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newHealthData)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.stepCount", is(12000)))
                .andExpect(jsonPath("$.heartRateAvg", is(80)));

        verify(healthDataService, times(1)).createOrUpdateHealthData(eq(1L), any(HealthData.class));
    }

    @Test
    void syncHealthData_WithValidHealthDataList_ShouldReturnSyncedHealthData() throws Exception {
        // Given
        List<HealthData> newHealthDataList = Arrays.asList(
                HealthData.builder().date(LocalDate.now()).stepCount(12000).heartRateAvg(80).sleepDurationMinutes(420).build(),
                HealthData.builder().date(LocalDate.now().minusDays(1)).stepCount(9000).heartRateAvg(75).sleepDurationMinutes(480).build()
        );

        List<HealthData> syncedHealthDataList = Arrays.asList(
                HealthData.builder().id(3L).user(testUser).date(LocalDate.now()).stepCount(12000).heartRateAvg(80).sleepDurationMinutes(420).build(),
                HealthData.builder().id(4L).user(testUser).date(LocalDate.now().minusDays(1)).stepCount(9000).heartRateAvg(75).sleepDurationMinutes(480).build()
        );

        when(healthDataService.syncHealthData(eq(1L), anyList())).thenReturn(syncedHealthDataList);

        // When & Then
        mockMvc.perform(post("/api/health-data/user/1/sync")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newHealthDataList)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(3)))
                .andExpect(jsonPath("$[0].stepCount", is(12000)))
                .andExpect(jsonPath("$[1].id", is(4)))
                .andExpect(jsonPath("$[1].stepCount", is(9000)));

        verify(healthDataService, times(1)).syncHealthData(eq(1L), anyList());
    }

    @Test
    void deleteHealthData_WithExistingId_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(healthDataService).deleteHealthData(1L);

        // When & Then
        mockMvc.perform(delete("/api/health-data/1"))
                .andExpect(status().isNoContent());

        verify(healthDataService, times(1)).deleteHealthData(1L);
    }

    @Test
    void countHealthDataByUser_ShouldReturnCount() throws Exception {
        // Given
        when(healthDataService.countByUser(1L)).thenReturn(2L);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/count"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", is(2)));

        verify(healthDataService, times(1)).countByUser(1L);
    }

    @Test
    void getAverageStepCount_ShouldReturnAverageStepCount() throws Exception {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(healthDataService.getAverageStepCount(1L, startDate, endDate)).thenReturn(9000.0);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/average-steps")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", is(9000.0)));

        verify(healthDataService, times(1)).getAverageStepCount(1L, startDate, endDate);
    }

    @Test
    void getAverageHeartRate_ShouldReturnAverageHeartRate() throws Exception {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(healthDataService.getAverageHeartRate(1L, startDate, endDate)).thenReturn(73.5);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/average-heart-rate")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", is(73.5)));

        verify(healthDataService, times(1)).getAverageHeartRate(1L, startDate, endDate);
    }

    @Test
    void getAverageSleepDuration_ShouldReturnAverageSleepDuration() throws Exception {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(healthDataService.getAverageSleepDuration(1L, startDate, endDate)).thenReturn(7.75);

        // When & Then
        mockMvc.perform(get("/api/health-data/user/1/average-sleep")
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", is(7.75)));

        verify(healthDataService, times(1)).getAverageSleepDuration(1L, startDate, endDate);
    }

    @Test
    void getSamsungHealthAuthUrl_ShouldReturnAuthUrl() throws Exception {
        // Given
        when(samsungHealthService.getAuthorizationUrl(1L)).thenReturn("https://samsung-health-auth-url.com");

        // When & Then
        mockMvc.perform(get("/api/health-data/samsung/auth")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.authUrl", is("https://samsung-health-auth-url.com")));

        verify(samsungHealthService, times(1)).getAuthorizationUrl(1L);
    }

    @Test
    void syncSamsungHealthData_ShouldReturnSyncedData() throws Exception {
        // Given
        when(samsungHealthService.syncHealthData(eq(1L), anyString())).thenReturn(testHealthDataList);

        // When & Then
        mockMvc.perform(post("/api/health-data/samsung/sync")
                .param("userId", "1")
                .param("accessToken", "test-token"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].stepCount", is(10000)));

        verify(samsungHealthService, times(1)).syncHealthData(eq(1L), anyString());
    }
}
