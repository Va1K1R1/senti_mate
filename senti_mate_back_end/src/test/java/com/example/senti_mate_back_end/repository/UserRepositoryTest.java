package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the UserRepository.
 */
@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveUser() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .build();

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertNotNull(savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("password123", savedUser.getPassword());
        assertEquals("Test", savedUser.getFirstName());
        assertEquals("User", savedUser.getLastName());
    }

    @Test
    public void testFindByUsername() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        // When
        Optional<User> foundUser = userRepository.findByUsername("testuser");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }

    @Test
    public void testFindByEmail() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        // When
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("test@example.com", foundUser.get().getEmail());
    }

    @Test
    public void testExistsByUsername() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        // When
        boolean exists = userRepository.existsByUsername("testuser");

        // Then
        assertTrue(exists);
    }

    @Test
    public void testExistsByEmail() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        // When
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Then
        assertTrue(exists);
    }
}