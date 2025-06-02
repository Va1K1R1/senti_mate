# Samsung Health SDK Web API & OpenAI API 문서화
실제 API 문서와 공식 사이트의 정보를 기반으로 Samsung Health SDK와 OpenAI API의 사용 예시를 정리했습니다.
## 1. Samsung Health SDK Web API
### 1.1 기본 정보
- **공식 문서**: [https://developer.samsung.com/health](https://developer.samsung.com/health)
- **API Base URL**: `https://shealth.samsung.com`
- **인증 방식**: OAuth 2.0
- **데이터 형식**: JSON

### 1.2 OAuth 2.0 인증 플로우
#### 1단계: 인증 URL 생성
``` javascript
const authUrl = `https://account.samsung.com/mobile/account/check.do?${new URLSearchParams({
  client_id: 'YOUR_CLIENT_ID',
  response_type: 'code',
  redirect_uri: 'https://your-app.com/callback',
  scope: 'shealth:read.step_count,shealth:read.heart_rate,shealth:read.sleep_session,shealth:read.exercise_session'
})}`;
```
#### 2단계: 액세스 토큰 교환
``` http
POST https://account.samsung.com/mobile/account/token.do
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
code=AUTHORIZATION_CODE&
redirect_uri=https://your-app.com/callback
```
**응답 예시:**
``` json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "shealth:read.step_count shealth:read.heart_rate"
}
```
### 1.3 주요 API 엔드포인트
#### 걸음 수 데이터 조회
``` http
GET https://shealth.samsung.com/v3/healthdata/step_daily_trend
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-01-31T23:59:59Z",
  "time_zone": "Asia/Seoul"
}
```
**응답 예시:**
``` json
{
  "result": [
    {
      "date": "2024-01-01",
      "step_count": 8543,
      "distance": 6.2,
      "calories": 320
    },
    {
      "date": "2024-01-02",
      "step_count": 12890,
      "distance": 9.4,
      "calories": 485
    }
  ],
  "has_more": false
}
```
#### 심박수 데이터 조회
``` http
GET https://shealth.samsung.com/v3/healthdata/heart_rate
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-01-01T23:59:59Z",
  "time_zone": "Asia/Seoul"
}
```
**응답 예시:**
``` json
{
  "result": [
    {
      "timestamp": "2024-01-01T09:30:00Z",
      "heart_rate": 72,
      "measurement_type": "resting"
    },
    {
      "timestamp": "2024-01-01T14:15:00Z",
      "heart_rate": 145,
      "measurement_type": "exercise"
    }
  ],
  "summary": {
    "avg_heart_rate": 78,
    "min_heart_rate": 65,
    "max_heart_rate": 156,
    "resting_heart_rate": 70
  }
}
```
#### 수면 데이터 조회
``` http
GET https://shealth.samsung.com/v3/healthdata/sleep
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-01-01T23:59:59Z",
  "time_zone": "Asia/Seoul"
}
```
**응답 예시:**
``` json
{
  "result": [
    {
      "sleep_date": "2024-01-01",
      "bedtime": "2024-01-01T23:30:00Z",
      "wake_time": "2024-01-02T07:15:00Z",
      "total_sleep_duration": 450,
      "deep_sleep_duration": 135,
      "light_sleep_duration": 270,
      "rem_sleep_duration": 45,
      "sleep_efficiency": 87.5,
      "sleep_quality_score": 82
    }
  ]
}
```
#### 운동 데이터 조회
``` http
GET https://shealth.samsung.com/v3/healthdata/exercise
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-01-31T23:59:59Z",
  "exercise_type": "running"
}
```
**응답 예시:**
``` json
{
  "result": [
    {
      "exercise_id": "ex_12345",
      "exercise_type": "running",
      "start_time": "2024-01-01T06:00:00Z",
      "end_time": "2024-01-01T06:45:00Z",
      "duration": 45,
      "distance": 5.2,
      "calories_burned": 420,
      "avg_heart_rate": 142,
      "max_heart_rate": 168,
      "avg_pace": "5:30",
      "elevation_gain": 23
    }
  ]
}
```
### 1.4 Java/Spring Boot 구현 예시
``` java
@Service
@RequiredArgsConstructor
@Slf4j
public class SamsungHealthService {
    
    @Value("${samsung.health.base-url:https://shealth.samsung.com}")
    private String baseUrl;
    
    @Value("${samsung.health.client-id}")
    private String clientId;
    
    @Value("${samsung.health.client-secret}")
    private String clientSecret;
    
    private final RestTemplate restTemplate;
    
    public Map<String, Object> getStepsData(String accessToken, LocalDate startDate, LocalDate endDate) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = Map.of(
            "start_time", startDate.atStartOfDay().atZone(ZoneOffset.UTC).toString(),
            "end_time", endDate.atTime(23, 59, 59).atZone(ZoneOffset.UTC).toString(),
            "time_zone", "Asia/Seoul"
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/v3/healthdata/step_daily_trend",
                HttpMethod.GET,
                entity,
                Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Samsung Health API 호출 실패", e);
            throw new RuntimeException("건강 데이터를 가져올 수 없습니다.");
        }
    }
    
    public Map<String, Object> getHeartRateData(String accessToken, LocalDate date) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = Map.of(
            "start_time", date.atStartOfDay().atZone(ZoneOffset.UTC).toString(),
            "end_time", date.atTime(23, 59, 59).atZone(ZoneOffset.UTC).toString(),
            "time_zone", "Asia/Seoul"
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/v3/healthdata/heart_rate",
                HttpMethod.GET,
                entity,
                Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("심박수 데이터 조회 실패", e);
            return Map.of();
        }
    }
}
```
## 2. OpenAI ChatGPT API
### 2.1 기본 정보
- **공식 문서**: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)
- **API Base URL**: `https://api.openai.com/v1`
- **인증 방식**: Bearer Token (API Key)
- **데이터 형식**: JSON

### 2.2 Chat Completions API
#### 기본 요청 구조
``` http
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "system", "content": "You are a helpful wellness coach."},
    {"role": "user", "content": "오늘 기분이 좋지 않고 스트레스가 많아요. 조언해주세요."}
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```
[[1]](https://www.jetbrains.com/help/idea/2025.1/http-response-handling-examples.html#script-var-example)의 예시를 참고하여 IntelliJ IDEA의 HTTP Client에서 토큰을 관리할 수 있습니다.
#### 응답 예시
``` json
{
  "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
  "object": "chat.completion",
  "created": 1677649420,
  "model": "gpt-3.5-turbo",
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 31,
    "total_tokens": 87
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "스트레스를 받고 계신 것 같네요. 먼저 깊게 숨을 쉬어보세요. 오늘 하루 중 작은 성취나 긍정적인 순간들을 떠올려보시는 것도 도움이 될 것 같습니다. 산책이나 가벼운 운동, 좋아하는 음악 감상 등으로 기분 전환을 해보시는 건 어떨까요?"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```
### 2.3 건강 일기 분석용 프롬프트 예시
#### 감정 및 건강 데이터 분석 요청
``` http
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system", 
      "content": "당신은 전문적인 웰니스 코치이자 감정 분석 전문가입니다. 사용자의 일기, 감정 상태, 건강 데이터를 종합적으로 분석하여 개인화된 조언을 제공해주세요. 따뜻하고 격려하는 톤으로 답변해주세요."
    },
    {
      "role": "user",
      "content": "=== 오늘의 일기 ===\n오늘은 회사에서 프레젠테이션이 있었는데 너무 긴장해서 제대로 못한 것 같다. 점심도 제대로 못 먹고 계속 불안했다. 집에 와서도 마음이 편하지 않다.\n\n=== 감정 데이터 ===\n기분: 안 좋음\n스트레스 레벨: 8/10\n에너지 레벨: 3/10\n수면 질: 4/10\n\n=== 건강 데이터 ===\n걸음 수: 3,200보\n평균 심박수: 82bpm\n수면 시간: 5시간 30분\n운동 시간: 0분\n\n위 정보를 바탕으로 다음과 같은 분석과 조언을 해주세요:\n1. 현재 감정 상태 분석\n2. 건강 데이터와 감정의 연관성\n3. 스트레스 완화를 위한 구체적인 방법\n4. 내일을 위한 개선 목표"
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```
#### 예상 응답
``` json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "**현재 감정 상태 분석** 📊\n프레젠테이션으로 인한 스트레스가 하루 종일 지속되고 있는 상황이네요. 높은 스트레스 레벨(8/10)과 낮은 에너지(3/10)는 정신적 피로가 상당함을 보여줍니다.\n\n**건강과 감정의 연관성** 💓\n• 평균 심박수 82bpm은 평소보다 높아 보이며, 이는 스트레스와 불안감의 신체적 반영입니다\n• 수면 시간 5.5시간과 수면 질 4/10은 충분한 회복을 하지 못했음을 의미합니다\n• 걸음 수 3,200보는 평소보다 적어 보이며, 활동량 부족이 기분에 영향을 줄 수 있습니다\n\n**스트레스 완화 방법** 🌱\n1. **즉시 실행**: 4-7-8 호흡법을 3회 반복해보세요\n2. **오늘 저녁**: 따뜻한 차 한 잔과 함께 10분간 명상하기\n3. **신체 활동**: 가벼운 스트레칭이나 15분 산책으로 긴장 풀기\n4. **영양 보충**: 건너뛴 점심 대신 가벼운 간식으로 혈당 안정화\n\n**내일의 개선 목표** 🎯\n• 7시간 이상 충분한 수면 취하기\n• 아침에 5분간 긍정적인 다짐하기\n• 점심시간에 10분 산책하여 6,000보 이상 걷기\n• 스트레스 상황에서 심호흡 3회 실행하기\n\n오늘의 프레젠테이션도 하나의 소중한 경험이 될 거예요. 완벽하지 않더라도 도전한 자신을 인정해주세요! 💪"
      }
    }
  ]
}
```
### 2.4 Java/Spring Boot 구현 예시
``` java
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatGPTService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;
    
    private final RestTemplate restTemplate;
    
    public String analyzeEmotionAndHealth(String diaryContent, 
                                        Map<String, Object> healthData, 
                                        Map<String, Object> emotionData) {
        try {
            String prompt = buildAnalysisPrompt(diaryContent, healthData, emotionData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                    Map.of("role", "system", "content", "당신은 전문적인 웰니스 코치이자 감정 분석 전문가입니다."),
                    Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 1000,
                "temperature", 0.7
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map responseBody = response.getBody();
                List<Map> choices = (List<Map>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map firstChoice = choices.get(0);
                    Map message = (Map) firstChoice.get("message");
                    return (String) message.get("content");
                }
            }
            
            return "분석 결과를 가져올 수 없습니다.";
            
        } catch (Exception e) {
            log.error("ChatGPT API 호출 중 오류 발생", e);
            return "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
    }
    
    private String buildAnalysisPrompt(String diaryContent, 
                                     Map<String, Object> healthData, 
                                     Map<String, Object> emotionData) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("=== 오늘의 일기 ===\n");
        prompt.append(diaryContent).append("\n\n");
        
        prompt.append("=== 감정 데이터 ===\n");
        prompt.append("기분: ").append(emotionData.get("mood")).append("\n");
        prompt.append("스트레스 레벨: ").append(emotionData.get("stressLevel")).append("/10\n");
        prompt.append("에너지 레벨: ").append(emotionData.get("energyLevel")).append("/10\n");
        prompt.append("수면 질: ").append(emotionData.get("sleepQuality")).append("/10\n\n");
        
        prompt.append("=== 건강 데이터 ===\n");
        if (healthData.get("steps") != null) {
            prompt.append("걸음 수: ").append(String.format("%,d", healthData.get("steps"))).append("보\n");
        }
        if (healthData.get("heartRate") != null) {
            prompt.append("평균 심박수: ").append(healthData.get("heartRate")).append("bpm\n");
        }
        if (healthData.get("sleepDuration") != null) {
            int sleepMinutes = (Integer) healthData.get("sleepDuration");
            int hours = sleepMinutes / 60;
            int minutes = sleepMinutes % 60;
            prompt.append("수면 시간: ").append(hours).append("시간 ").append(minutes).append("분\n");
        }
        if (healthData.get("exerciseDuration") != null) {
            prompt.append("운동 시간: ").append(healthData.get("exerciseDuration")).append("분\n");
        }
        
        prompt.append("\n위 정보를 바탕으로 다음과 같은 분석과 조언을 해주세요:\n");
        prompt.append("1. 현재 감정 상태 분석\n");
        prompt.append("2. 건강 데이터와 감정의 연관성\n");
        prompt.append("3. 스트레스 완화를 위한 구체적인 방법\n");
        prompt.append("4. 내일을 위한 개선 목표\n");
        prompt.append("\n답변은 따뜻하고 격려하는 톤으로 작성해주세요.");
        
        return prompt.toString();
    }
}
```
### 2.5 토큰 사용량 최적화
``` java
@Component
public class ChatGPTTokenManager {
    
    private static final int MAX_TOKENS_PER_REQUEST = 4000;
    private static final int MAX_COMPLETION_TOKENS = 1000;
    
    public String optimizePrompt(String originalPrompt) {
        // 프롬프트 길이 최적화
        if (originalPrompt.length() > 3000) {
            return originalPrompt.substring(0, 3000) + "...";
        }
        return originalPrompt;
    }
    
    public Map<String, Object> createOptimizedRequest(String prompt) {
        return Map.of(
            "model", "gpt-3.5-turbo", // 비용 효율적인 모델 선택
            "messages", List.of(
                Map.of("role", "system", "content", "간결하고 실용적인 조언을 제공하는 웰니스 코치입니다."),
                Map.of("role", "user", "content", optimizePrompt(prompt))
            ),
            "max_tokens", MAX_COMPLETION_TOKENS,
            "temperature", 0.7,
            "presence_penalty", 0.1,
            "frequency_penalty", 0.1
        );
    }
}
```

