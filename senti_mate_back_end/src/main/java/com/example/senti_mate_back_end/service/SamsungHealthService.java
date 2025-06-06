package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Service for Samsung Health SDK Web API integration
 * 🚧 추후 개발 예정 - 현재 Mock 데이터 제공
 */
@Service
public class SamsungHealthService {

    private static final Logger logger = LoggerFactory.getLogger(SamsungHealthService.class);
    private final Random random = new Random();

    private final RestTemplate restTemplate;
    private final HealthDataService healthDataService;
    private final UserRepository userRepository;

    @Autowired
    public SamsungHealthService(RestTemplate samsungHealthRestTemplate,
                               HealthDataService healthDataService,
                               UserRepository userRepository) {
        this.restTemplate = samsungHealthRestTemplate;
        this.healthDataService = healthDataService;
        this.userRepository = userRepository;
    }

    /**
     * 🚧 추후 개발 예정: Samsung Health OAuth2 인증 URL 생성
     * @param userId 사용자 ID
     * @return Mock 인증 URL
     */
    public String getAuthorizationUrl(Long userId) {
        logger.info("🚧 [MOCK] Samsung Health 인증 URL 생성 요청 - User ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Mock URL 반환
        String mockUrl = "https://mock.samsunghealth.com/oauth2/authorize" +
                "?client_id=MOCK_CLIENT_ID" +
                "&redirect_uri=http://localhost:8080/auth/samsung-health/callback" +
                "&response_type=code" +
                "&scope=activity+sleep+heart_rate+exercise" +
                "&state=" + userId;
        
        logger.info("🚧 [MOCK] Mock 인증 URL 생성됨: {}", mockUrl);
        return mockUrl;
    }

    /**
     * 🚧 추후 개발 예정: Samsung Health OAuth2 콜백 처리
     * @param code 인증 코드
     * @param state 상태 파라미터 (사용자 ID)
     * @return Mock 성공 응답
     */
    public boolean handleOAuthCallback(String code, String state) {
        logger.info("🚧 [MOCK] Samsung Health OAuth 콜백 처리 - Code: {}, State: {}", code, state);
        
        try {
            Long userId = Long.parseLong(state);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            logger.info("🚧 [MOCK] 사용자 {}에 대한 OAuth 콜백 처리 완료", user.getUsername());
            
            // Mock 성공 응답
            return true;
        } catch (Exception e) {
            logger.error("🚧 [MOCK] OAuth 콜백 처리 중 오류 발생", e);
            return false;
        }
    }

    /**
     * 🚧 추후 개발 예정: Samsung Health 데이터 동기화
     * @param userId 사용자 ID
     * @param accessToken 액세스 토큰
     * @return Mock 건강 데이터 목록
     */
    public List<HealthData> syncHealthData(Long userId, String accessToken) {
        logger.info("🚧 [MOCK] Samsung Health 데이터 동기화 시작 - User ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        List<HealthData> mockHealthDataList = generateMockHealthData(userId);
        
        logger.info("🚧 [MOCK] {} 건의 Mock 건강 데이터 생성됨", mockHealthDataList.size());
        
        // Mock 데이터를 실제로 저장할지는 선택사항
        // return healthDataService.syncHealthData(userId, mockHealthDataList);
        
        return mockHealthDataList;
    }

    /**
     * Mock 건강 데이터 생성 (최근 7일)
     */
    private List<HealthData> generateMockHealthData(Long userId) {
        List<HealthData> healthDataList = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(i);
            
            HealthData mockData = HealthData.builder()
                    .date(date)
                    .stepCount(generateMockStepCount())
                    .heartRateAvg(generateMockHeartRate())
                    .heartRateMin(60 + random.nextInt(20))
                    .heartRateMax(90 + random.nextInt(50))
                    .sleepDurationMinutes(generateMockSleepDuration())
                    .deepSleepMinutes(90 + random.nextInt(120))
                    .lightSleepMinutes(180 + random.nextInt(180))
                    .remSleepMinutes(60 + random.nextInt(90))
                    .exerciseDurationMinutes(generateMockExerciseDuration())
                    .exerciseType(generateMockExerciseType())
                    .caloriesBurned(generateMockCalories())
                    .dataSource("Samsung Health (Mock)")
                    .syncStatus("MOCK_SYNCED")
                    .build();

            healthDataList.add(mockData);
        }

        return healthDataList;
    }

    private Integer generateMockStepCount() {
        return 3000 + random.nextInt(12000); // 3,000 ~ 15,000 걸음
    }

    private Integer generateMockHeartRate() {
        return 65 + random.nextInt(25); // 65 ~ 90 bpm
    }

    private Integer generateMockSleepDuration() {
        return 360 + random.nextInt(240); // 6 ~ 10 시간 (분 단위)
    }

    private Integer generateMockExerciseDuration() {
        return random.nextBoolean() ? 0 : 20 + random.nextInt(100); // 0분 또는 20~120분
    }

    private String generateMockExerciseType() {
        String[] exerciseTypes = {"걷기", "달리기", "자전거", "수영", "요가", "웨이트 트레이닝", "없음"};
        return exerciseTypes[random.nextInt(exerciseTypes.length)];
    }

    private Integer generateMockCalories() {
        return 1800 + random.nextInt(800); // 1,800 ~ 2,600 칼로리
    }
}