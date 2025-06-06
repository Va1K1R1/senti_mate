package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by username
     * @param username the username to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by email
     * @param email the email to search for
     * @return an Optional containing the user if found, or empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a username exists
     * @param username the username to check
     * @return true if the username exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Check if an email exists
     * @param email the email to check
     * @return true if the email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find users by active status
     * @param isActive the active status to search for
     * @return a list of users with the specified active status
     */
    List<User> findByIsActive(boolean isActive);

    /**
     * Find users by email verification status
     * @param isEmailVerified the email verification status to search for
     * @return a list of users with the specified email verification status
     */
    List<User> findByIsEmailVerified(boolean isEmailVerified);

    /**
     * Find users created after a specific date
     * @param date the date to search after
     * @return a list of users created after the specified date
     */
    List<User> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Find users with a specific role
     * @param roleName the role name to search for
     * @return a list of users with the specified role
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    /**
     * Find users with a specific role and active status
     * @param roleName the role name to search for
     * @param isActive the active status to search for
     * @return a list of users with the specified role and active status
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.isActive = :isActive")
    List<User> findByRoleNameAndIsActive(@Param("roleName") String roleName, @Param("isActive") boolean isActive);

    /**
     * Search users by username, email, first name, or last name
     * @param searchTerm the term to search for
     * @return a list of users matching the search term
     */
    @Query("SELECT u FROM User u WHERE u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm% OR u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm%")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
}
