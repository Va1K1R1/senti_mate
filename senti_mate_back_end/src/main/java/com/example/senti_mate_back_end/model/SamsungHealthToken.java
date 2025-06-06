package com.example.senti_mate_back_end.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity for storing Samsung Health OAuth tokens
 */
@Entity
@Table(name = "samsung_health_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SamsungHealthToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;
    
    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;
    
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;
    
    @Column(name = "token_type")
    private String tokenType = "Bearer";
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "scope")
    private String scope;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TokenStatus status = TokenStatus.ACTIVE;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Check if the token is expired
     * @return true if the token is expired, false otherwise
     */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
    
    /**
     * Check if the token needs to be refreshed (expires in less than 5 minutes)
     * @return true if the token needs to be refreshed, false otherwise
     */
    public boolean needsRefresh() {
        return expiresAt != null && LocalDateTime.now().plusMinutes(5).isAfter(expiresAt);
    }
    
    /**
     * Token status enum
     */
    public enum TokenStatus {
        ACTIVE, EXPIRED, REVOKED, ERROR
    }
}