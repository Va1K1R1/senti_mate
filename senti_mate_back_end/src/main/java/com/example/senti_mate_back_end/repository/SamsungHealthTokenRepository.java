package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.SamsungHealthToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for SamsungHealthToken entity
 */
@Repository
public interface SamsungHealthTokenRepository extends JpaRepository<SamsungHealthToken, Long> {
    
    /**
     * Find token by user ID
     * @param userId the user ID
     * @return an Optional containing the token if found, or empty if not found
     */
    Optional<SamsungHealthToken> findByUserId(Long userId);
    
    /**
     * Find token by user ID and status
     * @param userId the user ID
     * @param status the token status
     * @return an Optional containing the token if found, or empty if not found
     */
    Optional<SamsungHealthToken> findByUserIdAndStatus(Long userId, SamsungHealthToken.TokenStatus status);
    
    /**
     * Find tokens by status and expiration date before a given date
     * @param status the token status
     * @param dateTime the date time
     * @return a list of tokens
     */
    List<SamsungHealthToken> findByStatusAndExpiresAtBefore(
        SamsungHealthToken.TokenStatus status, LocalDateTime dateTime);
    
    /**
     * Find tokens by status and last sync date before a given date
     * @param status the token status
     * @param dateTime the date time
     * @return a list of tokens
     */
    List<SamsungHealthToken> findByStatusAndLastSyncAtBefore(
        SamsungHealthToken.TokenStatus status, LocalDateTime dateTime);
    
    /**
     * Update token status by user ID
     * @param userId the user ID
     * @param status the token status
     * @return the number of updated tokens
     */
    @Modifying
    @Query("UPDATE SamsungHealthToken t SET t.status = :status WHERE t.userId = :userId")
    int updateStatusByUserId(@Param("userId") Long userId, @Param("status") SamsungHealthToken.TokenStatus status);
    
    /**
     * Count tokens by status
     * @param status the token status
     * @return the number of tokens
     */
    long countByStatus(SamsungHealthToken.TokenStatus status);
}