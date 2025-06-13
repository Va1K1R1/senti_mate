package com.example.senti_mate_back_end.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * HealthData entity for Samsung Health integration
 */
@Entity
@Table(name = "health_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "step_count")
    private Integer stepCount;

    @Column(name = "heart_rate_avg")
    private Integer heartRateAvg;

    @Column(name = "heart_rate_min")
    private Integer heartRateMin;

    @Column(name = "heart_rate_max")
    private Integer heartRateMax;

    @Column(name = "sleep_duration_minutes")
    private Integer sleepDurationMinutes;

    @Column(name = "deep_sleep_minutes")
    private Integer deepSleepMinutes;

    @Column(name = "light_sleep_minutes")
    private Integer lightSleepMinutes;

    @Column(name = "rem_sleep_minutes")
    private Integer remSleepMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "exercise_duration_minutes")
    private Integer exerciseDurationMinutes;

    @Column(name = "exercise_type")
    private String exerciseType;

    @Column(name = "data_source")
    private String dataSource;

    @Column(name = "sync_status")
    private String syncStatus;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
}
