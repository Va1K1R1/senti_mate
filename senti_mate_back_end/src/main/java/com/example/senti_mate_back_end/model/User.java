package com.example.senti_mate_back_end.model;

import com.example.senti_mate_back_end.converter.StringListConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * User entity for authentication and user management
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "is_email_verified", nullable = false)
    @Builder.Default
    private boolean isEmailVerified = false;

    // Samsung Health integration fields
    @Column(name = "samsung_health_connected")
    @Builder.Default
    private Boolean samsungHealthConnected = false;

    @Column(name = "samsung_health_user_id")
    private String samsungHealthUserId;

    @Column(name = "samsung_health_connected_at")
    private LocalDateTime samsungHealthConnectedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "samsung_health_sync_status")
    @Builder.Default
    private SyncStatus samsungHealthSyncStatus = SyncStatus.NOT_CONNECTED;

    @Column(name = "last_samsung_health_sync")
    private LocalDateTime lastSamsungHealthSync;

    // Health goals (stored as JSON)
    @Column(name = "health_goals", columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    @Builder.Default
    private List<String> healthGoals = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DiaryEntry> diaryEntries = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HealthData> healthData = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Recommendation> recommendations = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    /**
     * Connect Samsung Health account
     * @param samsungHealthUserId the Samsung Health user ID
     */
    public void connectSamsungHealth(String samsungHealthUserId) {
        this.samsungHealthConnected = true;
        this.samsungHealthUserId = samsungHealthUserId;
        this.samsungHealthConnectedAt = LocalDateTime.now();
        this.samsungHealthSyncStatus = SyncStatus.CONNECTED;
    }

    /**
     * Disconnect Samsung Health account
     */
    public void disconnectSamsungHealth() {
        this.samsungHealthConnected = false;
        this.samsungHealthUserId = null;
        this.samsungHealthSyncStatus = SyncStatus.NOT_CONNECTED;
    }

    /**
     * Update last sync time
     */
    public void updateLastSyncTime() {
        this.lastSamsungHealthSync = LocalDateTime.now();
        this.samsungHealthSyncStatus = SyncStatus.SYNCED;
    }

    /**
     * Sync status enum
     */
    public enum SyncStatus {
        NOT_CONNECTED, CONNECTED, SYNCING, SYNCED, ERROR
    }
}
