package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.HealthDataController;
import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Adapter controller for health data operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/health-data")
public class HealthDataAdapter {

    private final HealthDataController healthDataController;
    private final UserService userService;

    @Autowired
    public HealthDataAdapter(HealthDataController healthDataController, UserService userService) {
        this.healthDataController = healthDataController;
        this.userService = userService;
    }

    /**
     * Get all health data for the current user.
     * Maps to the backend's /api/health-data/user/{userId} endpoint.
     *
     * @return the ResponseEntity with the list of health data
     */
    @GetMapping
    public ResponseEntity<List<HealthData>> getAllHealthData() {
        Long userId = getCurrentUserId();
        return healthDataController.getAllHealthDataByUser(userId);
    }

    /**
     * Get health data by type for the current user.
     * Maps to the backend's /api/health-data/user/{userId} endpoint and filters by type.
     *
     * @param type the health data type (e.g., 'steps', 'heart_rate', 'sleep', 'exercise')
     * @return the ResponseEntity with the filtered list of health data
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<HealthData>> getHealthDataByType(@PathVariable String type) {
        Long userId = getCurrentUserId();
        ResponseEntity<List<HealthData>> response = healthDataController.getAllHealthDataByUser(userId);

        if (response.getBody() == null) {
            return ResponseEntity.ok(List.of());
        }

        // Filter the health data by type
        List<HealthData> filteredData = response.getBody().stream()
                .filter(data -> {
                    switch (type) {
                        case "steps":
                            return data.getStepCount() != null;
                        case "heart_rate":
                            return data.getHeartRateAvg() != null;
                        case "sleep":
                            return data.getSleepDurationMinutes() != null;
                        case "exercise":
                            return data.getExerciseDurationMinutes() != null;
                        default:
                            return false;
                    }
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredData);
    }

    /**
     * Get health data by date range for the current user.
     * Maps to the backend's /api/health-data/user/{userId}/date-range endpoint.
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with the list of health data within the date range
     */
    @GetMapping("/range")
    public ResponseEntity<List<HealthData>> getHealthDataByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long userId = getCurrentUserId();
        return healthDataController.getHealthDataByUserAndDateRange(userId, startDate, endDate);
    }

    /**
     * Sync health data from Samsung Health for the current user.
     * Maps to the backend's /api/health-data/samsung/sync endpoint.
     *
     * @return the ResponseEntity with the sync status
     */
    @PostMapping("/sync")
    public ResponseEntity<?> syncHealthData() {
        Long userId = getCurrentUserId();
        // Get the access token from the user or a token service
        // This is a simplification - in a real implementation, we would need to get the actual token
        String accessToken = "dummy-token";
        return healthDataController.syncSamsungHealthData(userId, accessToken);
    }

    /**
     * Get health data statistics for the current user.
     * Maps to multiple backend endpoints to collect statistics.
     *
     * @param type the health data type (e.g., 'steps', 'heart_rate', 'sleep', 'exercise')
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with the health data statistics
     */
    @GetMapping("/stats/{type}")
    public ResponseEntity<Map<String, Object>> getHealthDataStats(
            @PathVariable String type,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long userId = getCurrentUserId();

        Map<String, Object> stats = new HashMap<>();
        stats.put("type", type);
        stats.put("startDate", startDate);
        stats.put("endDate", endDate);

        // Get the appropriate statistics based on the type
        switch (type) {
            case "steps":
                ResponseEntity<Double> stepsResponse = healthDataController.getAverageStepCount(userId, startDate, endDate);
                stats.put("average", stepsResponse.getBody());
                break;
            case "heart_rate":
                ResponseEntity<Double> heartRateResponse = healthDataController.getAverageHeartRate(userId, startDate, endDate);
                stats.put("average", heartRateResponse.getBody());
                break;
            case "sleep":
                ResponseEntity<Double> sleepResponse = healthDataController.getAverageSleepDuration(userId, startDate, endDate);
                stats.put("average", sleepResponse.getBody());
                break;
            default:
                stats.put("average", 0.0);
                break;
        }

        return ResponseEntity.ok(stats);
    }

    /**
     * Helper method to get the current user ID from the security context.
     *
     * @return the current user ID
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"))
                .getId();
    }
}
