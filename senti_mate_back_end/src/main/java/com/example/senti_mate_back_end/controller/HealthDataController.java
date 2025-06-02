package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.service.HealthDataService;
import com.example.senti_mate_back_end.service.SamsungHealthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing health data operations
 */
@RestController
@RequestMapping("/api/health-data")
public class HealthDataController {

    private static final Logger logger = LoggerFactory.getLogger(HealthDataController.class);

    private final HealthDataService healthDataService;
    private final SamsungHealthService samsungHealthService;

    @Autowired
    public HealthDataController(HealthDataService healthDataService, SamsungHealthService samsungHealthService) {
        this.healthDataService = healthDataService;
        this.samsungHealthService = samsungHealthService;
    }

    /**
     * GET /api/health-data/user/{userId} : Get all health data for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the list of health data in body
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HealthData>> getAllHealthDataByUser(@PathVariable Long userId) {
        try {
            List<HealthData> healthDataList = healthDataService.findAllByUser(userId);
            return ResponseEntity.ok(healthDataList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/user/{userId}/paged : Get all health data for a user with pagination
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of health data in body
     */
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<HealthData>> getPagedHealthDataByUser(
            @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<HealthData> healthDataPage = healthDataService.findAllByUser(userId, pageable);
            return ResponseEntity.ok(healthDataPage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/{id} : Get the health data with the specified ID
     * @param id the ID of the health data to retrieve
     * @return the ResponseEntity with status 200 (OK) and the health data in body, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<HealthData> getHealthDataById(@PathVariable Long id) {
        return healthDataService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/health-data/user/{userId}/date/{date} : Find health data for a user on a specific date
     * @param userId the ID of the user
     * @param date the date
     * @return the ResponseEntity with status 200 (OK) and the health data in body, or with status 404 (Not Found)
     */
    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<HealthData> getHealthDataByUserAndDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return healthDataService.findByUserAndDate(userId, date)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/user/{userId}/date-range : Find health data for a user in a date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the list of health data in body
     */
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<HealthData>> getHealthDataByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<HealthData> healthDataList = healthDataService.findByUserAndDateRange(userId, startDate, endDate);
            return ResponseEntity.ok(healthDataList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/user/{userId}/min-steps/{minStepCount} : Find health data for a user with minimum step count
     * @param userId the ID of the user
     * @param minStepCount the minimum step count
     * @return the ResponseEntity with status 200 (OK) and the list of health data in body
     */
    @GetMapping("/user/{userId}/min-steps/{minStepCount}")
    public ResponseEntity<List<HealthData>> getHealthDataByUserAndMinStepCount(
            @PathVariable Long userId,
            @PathVariable Integer minStepCount) {
        try {
            List<HealthData> healthDataList = healthDataService.findByUserAndMinStepCount(userId, minStepCount);
            return ResponseEntity.ok(healthDataList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/health-data/user/{userId} : Create or update health data for a user
     * @param userId the ID of the user
     * @param healthData the health data to create or update
     * @return the ResponseEntity with status 201 (Created) and the new health data in body
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<HealthData> createOrUpdateHealthData(
            @PathVariable Long userId,
            @Valid @RequestBody HealthData healthData) {
        try {
            HealthData createdHealthData = healthDataService.createOrUpdateHealthData(userId, healthData);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHealthData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/health-data/user/{userId}/sync : Sync multiple health data entries for a user
     * @param userId the ID of the user
     * @param healthDataList the list of health data to sync
     * @return the ResponseEntity with status 201 (Created) and the list of synced health data in body
     */
    @PostMapping("/user/{userId}/sync")
    public ResponseEntity<List<HealthData>> syncHealthData(
            @PathVariable Long userId,
            @Valid @RequestBody List<HealthData> healthDataList) {
        try {
            List<HealthData> syncedHealthData = healthDataService.syncHealthData(userId, healthDataList);
            return ResponseEntity.status(HttpStatus.CREATED).body(syncedHealthData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/health-data/{id} : Delete the health data with the specified ID
     * @param id the ID of the health data to delete
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthData(@PathVariable Long id) {
        try {
            healthDataService.deleteHealthData(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/user/{userId}/count : Count health data entries for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the count in body
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countHealthDataByUser(@PathVariable Long userId) {
        try {
            long count = healthDataService.countByUser(userId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/health-data/user/{userId}/average-steps : Get average step count for a user in a date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the average step count in body
     */
    @GetMapping("/user/{userId}/average-steps")
    public ResponseEntity<Double> getAverageStepCount(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double averageStepCount = healthDataService.getAverageStepCount(userId, startDate, endDate);
        return ResponseEntity.ok(averageStepCount);
    }

    /**
     * GET /api/health-data/user/{userId}/average-heart-rate : Get average heart rate for a user in a date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the average heart rate in body
     */
    @GetMapping("/user/{userId}/average-heart-rate")
    public ResponseEntity<Double> getAverageHeartRate(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double averageHeartRate = healthDataService.getAverageHeartRate(userId, startDate, endDate);
        return ResponseEntity.ok(averageHeartRate);
    }

    /**
     * GET /api/health-data/user/{userId}/average-sleep : Get average sleep duration for a user in a date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the average sleep duration in body
     */
    @GetMapping("/user/{userId}/average-sleep")
    public ResponseEntity<Double> getAverageSleepDuration(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double averageSleepDuration = healthDataService.getAverageSleepDuration(userId, startDate, endDate);
        return ResponseEntity.ok(averageSleepDuration);
    }

    /**
     * GET /api/health-data/samsung/auth : Get Samsung Health authorization URL
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the authorization URL in body
     */
    @GetMapping("/samsung/auth")
    public ResponseEntity<Map<String, String>> getSamsungHealthAuthUrl(@RequestParam Long userId) {
        try {
            String authUrl = samsungHealthService.getAuthorizationUrl(userId);
            return ResponseEntity.ok(Map.of("authUrl", authUrl));
        } catch (Exception e) {
            logger.error("Error getting Samsung Health auth URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get authorization URL: " + e.getMessage()));
        }
    }

    /**
     * GET /api/health-data/samsung/callback : Handle Samsung Health OAuth callback
     * @param code the authorization code
     * @param state the state parameter (user ID)
     * @return redirect to the frontend with success or error status
     */
    @GetMapping("/samsung/callback")
    public RedirectView handleSamsungHealthCallback(
            @RequestParam String code,
            @RequestParam String state) {
        try {
            boolean success = samsungHealthService.handleOAuthCallback(code, state);

            // Redirect to frontend with success or error status
            // In a real application, you would redirect to a specific frontend URL
            if (success) {
                return new RedirectView("/samsung-health-connected.html?success=true");
            } else {
                return new RedirectView("/samsung-health-connected.html?success=false&error=Failed+to+authenticate");
            }
        } catch (Exception e) {
            logger.error("Error handling Samsung Health callback", e);
            return new RedirectView("/samsung-health-connected.html?success=false&error=" + e.getMessage());
        }
    }

    /**
     * POST /api/health-data/samsung/sync : Manually sync Samsung Health data
     * @param userId the ID of the user
     * @param accessToken the access token
     * @return the ResponseEntity with status 200 (OK) and the synced health data in body
     */
    @PostMapping("/samsung/sync")
    public ResponseEntity<?> syncSamsungHealthData(
            @RequestParam Long userId,
            @RequestParam String accessToken) {
        try {
            List<HealthData> syncedData = samsungHealthService.syncHealthData(userId, accessToken);
            return ResponseEntity.ok(syncedData);
        } catch (Exception e) {
            logger.error("Error syncing Samsung Health data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to sync health data: " + e.getMessage()));
        }
    }
}
