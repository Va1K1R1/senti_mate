package com.example.senti_mate_back_end.model;

/**
 * Enum for recommendation categories
 */
public enum RecommendationCategory {
    HEALTH("건강"),
    EXERCISE("운동"),
    NUTRITION("영양"),
    SLEEP("수면"),
    MENTAL_HEALTH("정신 건강"),
    STRESS_MANAGEMENT("스트레스 관리"),
    PRODUCTIVITY("생산성"),
    SOCIAL("사회적 관계"),
    PERSONAL_GROWTH("개인 성장"),
    GENERAL("일반");

    private final String displayName;

    RecommendationCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Find category by name (case-insensitive)
     * @param name the category name
     * @return the category enum value, or GENERAL if not found
     */
    public static RecommendationCategory fromString(String name) {
        if (name == null || name.trim().isEmpty()) {
            return GENERAL;
        }
        
        try {
            return valueOf(name.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Try to match by display name
            for (RecommendationCategory category : values()) {
                if (category.displayName.equalsIgnoreCase(name)) {
                    return category;
                }
            }
            return GENERAL;
        }
    }
}