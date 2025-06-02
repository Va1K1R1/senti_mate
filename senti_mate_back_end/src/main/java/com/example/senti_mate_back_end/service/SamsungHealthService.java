package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for Samsung Health SDK Web API integration
 */
@Service
public class SamsungHealthService {

    private static final Logger logger = LoggerFactory.getLogger(SamsungHealthService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final RestTemplate restTemplate;
    private final HealthDataService healthDataService;
    private final UserRepository userRepository;

    @Value("${samsung.health.api-base-url}")
    private String apiBaseUrl;

    @Value("${samsung.health.client-id}")
    private String clientId;

    @Value("${samsung.health.client-secret}")
    private String clientSecret;

    @Value("${samsung.health.redirect-uri}")
    private String redirectUri;

    @Autowired
    public SamsungHealthService(RestTemplate samsungHealthRestTemplate,
                               HealthDataService healthDataService,
                               UserRepository userRepository) {
        this.restTemplate = samsungHealthRestTemplate;
        this.healthDataService = healthDataService;
        this.userRepository = userRepository;
    }

    /**
     * Generate the authorization URL for Samsung Health OAuth2 authentication
     * @param userId the user ID
     * @return the authorization URL
     */
    public String getAuthorizationUrl(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return apiBaseUrl + "/oauth2/authorize" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=activity sleep heart_rate exercise" +
                "&state=" + userId;
    }

    /**
     * Handle the OAuth2 callback from Samsung Health
     * @param code the authorization code
     * @param state the state parameter (user ID)
     * @return true if the authentication was successful, false otherwise
     */
    public boolean handleOAuthCallback(String code, String state) {
        try {
            Long userId = Long.parseLong(state);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            // Exchange the authorization code for an access token
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("grant_type", "authorization_code");
            map.add("code", code);
            map.add("client_id", clientId);
            map.add("client_secret", clientSecret);
            map.add("redirect_uri", redirectUri);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiBaseUrl + "/oauth2/token", 
                    request, 
                    Map.class);

            Map<String, Object> tokenResponse = response.getBody();

            if (tokenResponse != null && tokenResponse.containsKey("access_token")) {
                // Store the access token in the user's profile or session
                // This is a simplified example - in a real application, you would store the token securely
                String accessToken = (String) tokenResponse.get("access_token");

                // Sync the user's health data
                syncHealthData(userId, accessToken);

                return true;
            }

            return false;
        } catch (Exception e) {
            logger.error("Error handling OAuth callback", e);
            return false;
        }
    }

    /**
     * Sync health data from Samsung Health for a user
     * @param userId the user ID
     * @param accessToken the access token
     * @return the list of synced health data
     */
    public List<HealthData> syncHealthData(Long userId, String accessToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30); // Sync last 30 days of data

        List<HealthData> healthDataList = new ArrayList<>();

        // Fetch step count data
        healthDataList.addAll(fetchStepCountData(userId, accessToken, startDate, endDate));

        // Fetch heart rate data
        healthDataList.addAll(fetchHeartRateData(userId, accessToken, startDate, endDate));

        // Fetch sleep data
        healthDataList.addAll(fetchSleepData(userId, accessToken, startDate, endDate));

        // Fetch exercise data
        healthDataList.addAll(fetchExerciseData(userId, accessToken, startDate, endDate));

        // Save all health data
        return healthDataService.syncHealthData(userId, healthDataList);
    }

    /**
     * Fetch step count data from Samsung Health
     * @param userId the user ID
     * @param accessToken the access token
     * @param startDate the start date
     * @param endDate the end date
     * @return the list of health data with step count
     */
    private List<HealthData> fetchStepCountData(Long userId, String accessToken, LocalDate startDate, LocalDate endDate) {
        List<HealthData> healthDataList = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiBaseUrl + "/activity/step_count")
                    .queryParam("start_date", startDate.format(DATE_FORMATTER))
                    .queryParam("end_date", endDate.format(DATE_FORMATTER));

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class);

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");

                for (Map<String, Object> data : dataList) {
                    String dateStr = (String) data.get("date");
                    LocalDate date = LocalDate.parse(dateStr, DATE_FORMATTER);
                    Integer stepCount = (Integer) data.get("step_count");

                    HealthData healthData = HealthData.builder()
                            .date(date)
                            .stepCount(stepCount)
                            .dataSource("Samsung Health")
                            .syncStatus("SYNCED")
                            .build();

                    healthDataList.add(healthData);
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching step count data", e);
        }

        return healthDataList;
    }

    /**
     * Fetch heart rate data from Samsung Health
     * @param userId the user ID
     * @param accessToken the access token
     * @param startDate the start date
     * @param endDate the end date
     * @return the list of health data with heart rate
     */
    private List<HealthData> fetchHeartRateData(Long userId, String accessToken, LocalDate startDate, LocalDate endDate) {
        List<HealthData> healthDataList = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiBaseUrl + "/heart_rate")
                    .queryParam("start_date", startDate.format(DATE_FORMATTER))
                    .queryParam("end_date", endDate.format(DATE_FORMATTER));

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class);

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");

                for (Map<String, Object> data : dataList) {
                    String dateStr = (String) data.get("date");
                    LocalDate date = LocalDate.parse(dateStr, DATE_FORMATTER);
                    Integer heartRateAvg = (Integer) data.get("heart_rate_avg");
                    Integer heartRateMin = (Integer) data.get("heart_rate_min");
                    Integer heartRateMax = (Integer) data.get("heart_rate_max");

                    // Check if we already have a health data entry for this date
                    boolean found = false;
                    for (HealthData healthData : healthDataList) {
                        if (healthData.getDate().equals(date)) {
                            // Update existing health data
                            healthData.setHeartRateAvg(heartRateAvg);
                            healthData.setHeartRateMin(heartRateMin);
                            healthData.setHeartRateMax(heartRateMax);
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        // Create new health data
                        HealthData healthData = HealthData.builder()
                                .date(date)
                                .heartRateAvg(heartRateAvg)
                                .heartRateMin(heartRateMin)
                                .heartRateMax(heartRateMax)
                                .dataSource("Samsung Health")
                                .syncStatus("SYNCED")
                                .build();

                        healthDataList.add(healthData);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching heart rate data", e);
        }

        return healthDataList;
    }

    /**
     * Fetch sleep data from Samsung Health
     * @param userId the user ID
     * @param accessToken the access token
     * @param startDate the start date
     * @param endDate the end date
     * @return the list of health data with sleep data
     */
    private List<HealthData> fetchSleepData(Long userId, String accessToken, LocalDate startDate, LocalDate endDate) {
        List<HealthData> healthDataList = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiBaseUrl + "/sleep")
                    .queryParam("start_date", startDate.format(DATE_FORMATTER))
                    .queryParam("end_date", endDate.format(DATE_FORMATTER));

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class);

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");

                for (Map<String, Object> data : dataList) {
                    String dateStr = (String) data.get("date");
                    LocalDate date = LocalDate.parse(dateStr, DATE_FORMATTER);
                    Integer sleepDurationMinutes = (Integer) data.get("sleep_duration_minutes");
                    Integer deepSleepMinutes = (Integer) data.get("deep_sleep_minutes");
                    Integer lightSleepMinutes = (Integer) data.get("light_sleep_minutes");
                    Integer remSleepMinutes = (Integer) data.get("rem_sleep_minutes");

                    // Check if we already have a health data entry for this date
                    boolean found = false;
                    for (HealthData healthData : healthDataList) {
                        if (healthData.getDate().equals(date)) {
                            // Update existing health data
                            healthData.setSleepDurationMinutes(sleepDurationMinutes);
                            healthData.setDeepSleepMinutes(deepSleepMinutes);
                            healthData.setLightSleepMinutes(lightSleepMinutes);
                            healthData.setRemSleepMinutes(remSleepMinutes);
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        // Create new health data
                        HealthData healthData = HealthData.builder()
                                .date(date)
                                .sleepDurationMinutes(sleepDurationMinutes)
                                .deepSleepMinutes(deepSleepMinutes)
                                .lightSleepMinutes(lightSleepMinutes)
                                .remSleepMinutes(remSleepMinutes)
                                .dataSource("Samsung Health")
                                .syncStatus("SYNCED")
                                .build();

                        healthDataList.add(healthData);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching sleep data", e);
        }

        return healthDataList;
    }

    /**
     * Fetch exercise data from Samsung Health
     * @param userId the user ID
     * @param accessToken the access token
     * @param startDate the start date
     * @param endDate the end date
     * @return the list of health data with exercise data
     */
    private List<HealthData> fetchExerciseData(Long userId, String accessToken, LocalDate startDate, LocalDate endDate) {
        List<HealthData> healthDataList = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiBaseUrl + "/exercise")
                    .queryParam("start_date", startDate.format(DATE_FORMATTER))
                    .queryParam("end_date", endDate.format(DATE_FORMATTER));

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    Map.class);

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) responseBody.get("data");

                for (Map<String, Object> data : dataList) {
                    String dateStr = (String) data.get("date");
                    LocalDate date = LocalDate.parse(dateStr, DATE_FORMATTER);
                    Integer exerciseDurationMinutes = (Integer) data.get("duration_minutes");
                    String exerciseType = (String) data.get("exercise_type");
                    Integer caloriesBurned = (Integer) data.get("calories_burned");

                    // Check if we already have a health data entry for this date
                    boolean found = false;
                    for (HealthData healthData : healthDataList) {
                        if (healthData.getDate().equals(date)) {
                            // Update existing health data
                            healthData.setExerciseDurationMinutes(exerciseDurationMinutes);
                            healthData.setExerciseType(exerciseType);
                            healthData.setCaloriesBurned(caloriesBurned);
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        // Create new health data
                        HealthData healthData = HealthData.builder()
                                .date(date)
                                .exerciseDurationMinutes(exerciseDurationMinutes)
                                .exerciseType(exerciseType)
                                .caloriesBurned(caloriesBurned)
                                .dataSource("Samsung Health")
                                .syncStatus("SYNCED")
                                .build();

                        healthDataList.add(healthData);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching exercise data", e);
        }

        return healthDataList;
    }
}
