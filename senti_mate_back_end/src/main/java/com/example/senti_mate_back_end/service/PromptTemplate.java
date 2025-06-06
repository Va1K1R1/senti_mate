package com.example.senti_mate_back_end.service;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Template for generating prompts for ChatGPT
 */
@Component
@Slf4j
public class PromptTemplate {
    
    // Health recommendation system prompt
    public static final String HEALTH_RECOMMENDATION_SYSTEM = """
        당신은 전문적인 건강 관리 어시스턴트입니다. 
        사용자의 건강 데이터를 분석하여 개인화된 건강 추천사항을 제공해주세요.
        
        추천사항은 다음 형식으로 제공해주세요:
        1. 운동 추천 (구체적인 운동과 시간)
        2. 식단 조언 (영양소와 칼로리 고려)
        3. 생활습관 개선점
        4. 주의사항
        
        의학적 진단이나 치료는 제공하지 말고, 일반적인 건강 관리 조언만 제공해주세요.
        """;
    
    // Emotion analysis system prompt
    public static final String EMOTION_ANALYSIS_SYSTEM = """
        당신은 감정 분석 전문가입니다. 
        사용자의 일기 내용을 분석하여 감정 상태를 파악하고 조언을 제공해주세요.
        
        분석 결과는 다음 형식으로 제공해주세요:
        1. 주요 감정 (기쁨, 슬픔, 분노, 불안, 평온 등)
        2. 감정 강도 (1-10 점수)
        3. 감정의 원인 분석
        4. 감정 관리 조언
        5. 추천 활동
        
        전문적이지만 따뜻하고 공감적인 톤으로 응답해주세요.
        """;
    
    // Personalized advice system prompt
    public static final String PERSONALIZED_ADVICE_SYSTEM = """
        당신은 개인 맞춤형 건강 코치입니다.
        사용자의 건강 데이터, 목표, 현재 상황을 종합하여 개인화된 조언을 제공해주세요.
        
        조언은 다음을 포함해야 합니다:
        1. 현재 상태 평가
        2. 달성 가능한 단기 목표 (1주일)
        3. 중기 목표 (1개월)
        4. 구체적인 실행 계획
        5. 동기부여 메시지
        
        실현 가능하고 과학적 근거가 있는 조언을 제공해주세요.
        """;
    
    public String buildHealthRecommendationPrompt(HealthProfileData profileData) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("사용자 건강 프로필:\n");
        prompt.append("- 나이: ").append(profileData.getAge()).append("세\n");
        prompt.append("- 성별: ").append(profileData.getGender()).append("\n");
        prompt.append("- 키: ").append(profileData.getHeight()).append("cm\n");
        prompt.append("- 체중: ").append(profileData.getWeight()).append("kg\n");
        prompt.append("- BMI: ").append(profileData.getBmi()).append("\n");
        
        if (profileData.getRecentHealthData() != null) {
            prompt.append("\n최근 건강 데이터:\n");
            prompt.append("- 평균 심박수: ").append(profileData.getRecentHealthData().getAvgHeartRate()).append("bpm\n");
            prompt.append("- 평균 수면시간: ").append(profileData.getRecentHealthData().getAvgSleepHours()).append("시간\n");
            prompt.append("- 평균 걸음수: ").append(profileData.getRecentHealthData().getAvgSteps()).append("보\n");
            prompt.append("- 평균 칼로리 소모: ").append(profileData.getRecentHealthData().getAvgCaloriesBurned()).append("kcal\n");
        }
        
        if (profileData.getHealthGoals() != null && !profileData.getHealthGoals().isEmpty()) {
            prompt.append("\n건강 목표:\n");
            profileData.getHealthGoals().forEach(goal -> 
                prompt.append("- ").append(goal).append("\n"));
        }
        
        prompt.append("\n위 정보를 바탕으로 개인화된 건강 추천사항을 제공해주세요.");
        
        return prompt.toString();
    }
    
    public String buildEmotionAnalysisPrompt(String diaryContent) {
        return String.format("""
            다음은 사용자가 작성한 일기 내용입니다:
            
            "%s"
            
            위 일기 내용을 분석하여 사용자의 감정 상태를 파악하고 조언을 제공해주세요.
            """, diaryContent);
    }
    
    public String buildPersonalizedAdvicePrompt(UserContextData contextData) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("사용자 상황 정보:\n");
        prompt.append("- 현재 스트레스 레벨: ").append(contextData.getStressLevel()).append("/10\n");
        prompt.append("- 최근 운동 빈도: ").append(contextData.getExerciseFrequency()).append("\n");
        prompt.append("- 수면 패턴: ").append(contextData.getSleepPattern()).append("\n");
        prompt.append("- 주요 관심사: ").append(contextData.getMainConcerns()).append("\n");
        
        if (contextData.getRecentChallenges() != null) {
            prompt.append("- 최근 어려움: ").append(contextData.getRecentChallenges()).append("\n");
        }
        
        prompt.append("\n위 상황을 고려하여 개인 맞춤형 건강 관리 조언을 제공해주세요.");
        
        return prompt.toString();
    }
    
    @Data
    @Builder
    public static class HealthProfileData {
        private Integer age;
        private String gender;
        private Double height;
        private Double weight;
        private Double bmi;
        private RecentHealthData recentHealthData;
        private List<String> healthGoals;
        
        @Data
        @Builder
        public static class RecentHealthData {
            private Double avgHeartRate;
            private Double avgSleepHours;
            private Integer avgSteps;
            private Double avgCaloriesBurned;
        }
    }
    
    @Data
    @Builder
    public static class UserContextData {
        private Integer stressLevel;
        private String exerciseFrequency;
        private String sleepPattern;
        private String mainConcerns;
        private String recentChallenges;
    }
}