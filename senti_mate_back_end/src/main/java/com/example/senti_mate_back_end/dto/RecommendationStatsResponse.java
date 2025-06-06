package com.example.senti_mate_back_end.dto;

import com.example.senti_mate_back_end.model.RecommendationCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO for recommendation statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationStatsResponse {
    
    private Long userId;
    private Long totalCount;
    private Long unreadCount;
    private Long favoriteCount;
    
    private Map<RecommendationCategory, Long> countByCategory;
    private Map<RecommendationCategory, Long> unreadByCategory;
    
    private Map<Integer, Long> countByPriorityLevel;
    
    private RecommendationCategory mostCommonCategory;
    private Integer highestPriorityUnread;
    
    private LocalDateTime lastCreatedAt;
    private LocalDateTime lastReadAt;
    
    private LocalDateTime generatedAt;
}