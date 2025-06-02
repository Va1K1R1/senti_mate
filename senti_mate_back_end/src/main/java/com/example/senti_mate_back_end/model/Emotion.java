package com.example.senti_mate_back_end.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Emotion entity for emotion tracking
 */
@Entity
@Table(name = "emotions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Emotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Emotion name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "intensity")
    private Integer intensity;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "color_code")
    private String colorCode;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_entry_id", nullable = false)
    private DiaryEntry diaryEntry;
}