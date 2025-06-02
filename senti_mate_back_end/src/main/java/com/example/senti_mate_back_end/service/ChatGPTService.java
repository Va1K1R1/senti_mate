package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.HealthData;
import com.example.senti_mate_back_end.model.Recommendation;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for OpenAI ChatGPT API integration
 */
@Service
public class ChatGPTService {

    private static final Logger logger = LoggerFactory.getLogger(ChatGPTService.class);

    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryEntryRepository;
    private final HealthDataService healthDataService;
    private final RecommendationService recommendationService;
    
    @Value("${openai.model}")
    private String model;
    
    @Value("${openai.max-tokens}")
    private Integer maxTokens;
    
    @Value("${openai.temperature}")
    private Double temperature;

    @Autowired
    public ChatGPTService(UserRepository userRepository,
                         DiaryEntryRepository diaryEntryRepository,
                         HealthDataService healthDataService,
                         RecommendationService recommendationService) {
        this.userRepository = userRepository;
        this.diaryEntryRepository = diaryEntryRepository;
        this.healthDataService = healthDataService;
        this.recommendationService = recommendationService;
    }

    /**
     * Generate recommendations based on diary entries and health data
     * @param userId the user ID
     * @return the list of generated recommendations
     */
    public List<Recommendation> generateRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        // Get recent diary entries
        List<DiaryEntry> recentDiaryEntries = diaryEntryRepository.findTop10ByUserOrderByDateDesc(user);
        
        // Get recent health data
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        List<HealthData> recentHealthData = healthDataService.findByUserAndDateRange(userId, startDate, endDate);
        
        // Generate recommendations
        List<Recommendation> recommendations = new ArrayList<>();
        
        // Generate mood-based recommendations
        recommendations.addAll(generateMoodBasedRecommendations(userId, recentDiaryEntries));
        
        // Generate health-based recommendations
        recommendations.addAll(generateHealthBasedRecommendations(userId, recentHealthData));
        
        // Generate combined recommendations
        recommendations.addAll(generateCombinedRecommendations(userId, recentDiaryEntries, recentHealthData));
        
        // Save and return recommendations
        return recommendationService.createRecommendations(userId, recommendations);
    }

    /**
     * Generate recommendations based on mood analysis from diary entries
     * @param userId the user ID
     * @param diaryEntries the list of diary entries
     * @return the list of generated recommendations
     */
    private List<Recommendation> generateMoodBasedRecommendations(Long userId, List<DiaryEntry> diaryEntries) {
        List<Recommendation> recommendations = new ArrayList<>();
        
        if (diaryEntries.isEmpty()) {
            return recommendations;
        }
        
        try {
            // Prepare prompt for ChatGPT
            StringBuilder prompt = new StringBuilder();
            prompt.append("I'm going to share some recent diary entries. Based on these entries, please provide 3 personalized wellness recommendations to improve my mood and mental well-being. Format each recommendation with a title and detailed content.\n\n");
            
            // Add diary entries to prompt
            for (DiaryEntry entry : diaryEntries) {
                prompt.append("Date: ").append(entry.getDate()).append("\n");
                prompt.append("Mood: ").append(entry.getMood()).append("\n");
                prompt.append("Content: ").append(entry.getContent()).append("\n\n");
            }
            
            // Call ChatGPT API
            String response = callChatGPT(prompt.toString());
            
            // Parse recommendations from response
            recommendations.addAll(parseRecommendationsFromResponse(response, "Mood", userId, prompt.toString()));
            
        } catch (Exception e) {
            logger.error("Error generating mood-based recommendations", e);
        }
        
        return recommendations;
    }

    /**
     * Generate recommendations based on health data analysis
     * @param userId the user ID
     * @param healthData the list of health data
     * @return the list of generated recommendations
     */
    private List<Recommendation> generateHealthBasedRecommendations(Long userId, List<HealthData> healthData) {
        List<Recommendation> recommendations = new ArrayList<>();
        
        if (healthData.isEmpty()) {
            return recommendations;
        }
        
        try {
            // Prepare prompt for ChatGPT
            StringBuilder prompt = new StringBuilder();
            prompt.append("I'm going to share some recent health data. Based on this data, please provide 3 personalized wellness recommendations to improve my physical health. Format each recommendation with a title and detailed content.\n\n");
            
            // Calculate averages
            int totalSteps = 0;
            int totalSleep = 0;
            int totalHeartRate = 0;
            int totalExercise = 0;
            int countSteps = 0;
            int countSleep = 0;
            int countHeartRate = 0;
            int countExercise = 0;
            
            for (HealthData data : healthData) {
                if (data.getStepCount() != null) {
                    totalSteps += data.getStepCount();
                    countSteps++;
                }
                if (data.getSleepDurationMinutes() != null) {
                    totalSleep += data.getSleepDurationMinutes();
                    countSleep++;
                }
                if (data.getHeartRateAvg() != null) {
                    totalHeartRate += data.getHeartRateAvg();
                    countHeartRate++;
                }
                if (data.getExerciseDurationMinutes() != null) {
                    totalExercise += data.getExerciseDurationMinutes();
                    countExercise++;
                }
            }
            
            // Add health data to prompt
            prompt.append("Average daily steps: ").append(countSteps > 0 ? totalSteps / countSteps : "N/A").append("\n");
            prompt.append("Average sleep duration (minutes): ").append(countSleep > 0 ? totalSleep / countSleep : "N/A").append("\n");
            prompt.append("Average heart rate: ").append(countHeartRate > 0 ? totalHeartRate / countHeartRate : "N/A").append("\n");
            prompt.append("Average exercise duration (minutes): ").append(countExercise > 0 ? totalExercise / countExercise : "N/A").append("\n");
            
            // Call ChatGPT API
            String response = callChatGPT(prompt.toString());
            
            // Parse recommendations from response
            recommendations.addAll(parseRecommendationsFromResponse(response, "Health", userId, prompt.toString()));
            
        } catch (Exception e) {
            logger.error("Error generating health-based recommendations", e);
        }
        
        return recommendations;
    }

    /**
     * Generate recommendations based on combined analysis of diary entries and health data
     * @param userId the user ID
     * @param diaryEntries the list of diary entries
     * @param healthData the list of health data
     * @return the list of generated recommendations
     */
    private List<Recommendation> generateCombinedRecommendations(Long userId, List<DiaryEntry> diaryEntries, List<HealthData> healthData) {
        List<Recommendation> recommendations = new ArrayList<>();
        
        if (diaryEntries.isEmpty() || healthData.isEmpty()) {
            return recommendations;
        }
        
        try {
            // Prepare prompt for ChatGPT
            StringBuilder prompt = new StringBuilder();
            prompt.append("I'm going to share some recent diary entries and health data. Based on this combined information, please provide 3 personalized wellness recommendations that address both my mental and physical well-being. Format each recommendation with a title and detailed content.\n\n");
            
            // Add diary entries to prompt
            prompt.append("Recent mood trends:\n");
            for (DiaryEntry entry : diaryEntries.subList(0, Math.min(5, diaryEntries.size()))) {
                prompt.append("Date: ").append(entry.getDate()).append(", Mood: ").append(entry.getMood()).append("\n");
            }
            prompt.append("\n");
            
            // Calculate health data averages
            int totalSteps = 0;
            int totalSleep = 0;
            int countSteps = 0;
            int countSleep = 0;
            
            for (HealthData data : healthData) {
                if (data.getStepCount() != null) {
                    totalSteps += data.getStepCount();
                    countSteps++;
                }
                if (data.getSleepDurationMinutes() != null) {
                    totalSleep += data.getSleepDurationMinutes();
                    countSleep++;
                }
            }
            
            // Add health data to prompt
            prompt.append("Health data:\n");
            prompt.append("Average daily steps: ").append(countSteps > 0 ? totalSteps / countSteps : "N/A").append("\n");
            prompt.append("Average sleep duration (minutes): ").append(countSleep > 0 ? totalSleep / countSleep : "N/A").append("\n");
            
            // Call ChatGPT API
            String response = callChatGPT(prompt.toString());
            
            // Parse recommendations from response
            recommendations.addAll(parseRecommendationsFromResponse(response, "Wellness", userId, prompt.toString()));
            
        } catch (Exception e) {
            logger.error("Error generating combined recommendations", e);
        }
        
        return recommendations;
    }

    /**
     * Call the ChatGPT API with a prompt
     * @param prompt the prompt to send to ChatGPT
     * @return the response from ChatGPT
     */
    private String callChatGPT(String prompt) {
        // This is a placeholder for the actual API call
        // In a real implementation, you would use the OpenAI Java client library
        
        logger.info("Calling ChatGPT API with prompt: {}", prompt);
        
        // Simulate API call
        // In a real implementation, you would use the OpenAiService bean
        return "Recommendation 1: Improve Sleep Quality\n" +
                "Based on your recent sleep patterns, try establishing a consistent sleep schedule. Go to bed and wake up at the same time every day, even on weekends. Create a relaxing bedtime routine that includes dimming lights, avoiding screens for at least an hour before bed, and perhaps reading or meditating. Consider using a white noise machine or app if noise disrupts your sleep.\n\n" +
                "Recommendation 2: Mindful Movement\n" +
                "Your step count shows room for improvement. Try incorporating more walking into your daily routine. Take short walking breaks during work, use stairs instead of elevators, or park farther from entrances. Even a 10-minute walk can boost mood and energy. Consider setting a reminder to move every hour.\n\n" +
                "Recommendation 3: Emotional Journaling\n" +
                "Your diary entries show fluctuating moods. Try dedicated emotional journaling for 10 minutes each evening. Write specifically about your emotions, their triggers, and how you responded. This practice can help you identify patterns and develop healthier emotional responses over time.";
    }

    /**
     * Parse recommendations from the ChatGPT response
     * @param response the response from ChatGPT
     * @param category the category of the recommendations
     * @param userId the user ID
     * @param prompt the prompt sent to ChatGPT
     * @return the list of parsed recommendations
     */
    private List<Recommendation> parseRecommendationsFromResponse(String response, String category, Long userId, String prompt) {
        List<Recommendation> recommendations = new ArrayList<>();
        
        try {
            // Split the response by "Recommendation" to get individual recommendations
            String[] parts = response.split("Recommendation \\d+: ");
            
            // Skip the first part (empty or introduction)
            for (int i = 1; i < parts.length; i++) {
                String part = parts[i].trim();
                
                // Extract title and content
                int titleEndIndex = part.indexOf("\n");
                if (titleEndIndex == -1) {
                    titleEndIndex = part.length();
                }
                
                String title = part.substring(0, titleEndIndex).trim();
                String content = part.substring(Math.min(titleEndIndex + 1, part.length())).trim();
                
                // Create recommendation
                Recommendation recommendation = Recommendation.builder()
                        .title(title)
                        .content(content)
                        .category(category)
                        .priorityLevel(3) // Medium priority
                        .isRead(false)
                        .isFavorite(false)
                        .source("ChatGPT")
                        .sourcePrompt(prompt)
                        .sourceResponse(response)
                        .build();
                
                recommendations.add(recommendation);
            }
        } catch (Exception e) {
            logger.error("Error parsing recommendations from response", e);
        }
        
        return recommendations;
    }

    /**
     * Analyze the sentiment of a diary entry
     * @param diaryEntry the diary entry to analyze
     * @return the sentiment analysis result
     */
    public Map<String, Object> analyzeSentiment(DiaryEntry diaryEntry) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Prepare prompt for ChatGPT
            StringBuilder prompt = new StringBuilder();
            prompt.append("Please analyze the sentiment and emotions in the following diary entry. Provide a detailed analysis including the primary emotion, secondary emotions, overall sentiment (positive, negative, or neutral), and any patterns or triggers you notice. Also suggest one small action the person could take to improve their well-being based on this entry.\n\n");
            prompt.append("Diary Entry:\n");
            prompt.append(diaryEntry.getContent());
            
            // Call ChatGPT API
            String response = callChatGPT(prompt.toString());
            
            // Parse sentiment analysis from response
            // This is a simplified parsing logic
            result.put("analysis", response);
            
            // Determine primary emotion (simplified)
            if (response.toLowerCase().contains("happy") || response.toLowerCase().contains("joy")) {
                result.put("primaryEmotion", "Happy");
            } else if (response.toLowerCase().contains("sad") || response.toLowerCase().contains("sadness")) {
                result.put("primaryEmotion", "Sad");
            } else if (response.toLowerCase().contains("angry") || response.toLowerCase().contains("anger")) {
                result.put("primaryEmotion", "Angry");
            } else if (response.toLowerCase().contains("anxious") || response.toLowerCase().contains("anxiety")) {
                result.put("primaryEmotion", "Anxious");
            } else {
                result.put("primaryEmotion", "Neutral");
            }
            
            // Determine sentiment (simplified)
            if (response.toLowerCase().contains("positive")) {
                result.put("sentiment", "Positive");
            } else if (response.toLowerCase().contains("negative")) {
                result.put("sentiment", "Negative");
            } else {
                result.put("sentiment", "Neutral");
            }
            
        } catch (Exception e) {
            logger.error("Error analyzing sentiment", e);
            result.put("error", "Failed to analyze sentiment: " + e.getMessage());
        }
        
        return result;
    }
}