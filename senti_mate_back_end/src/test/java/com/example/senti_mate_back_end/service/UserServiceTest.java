package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.dto.request.RegisterRequest;
import com.example.senti_mate_back_end.dto.request.UpdateUserRequest;
import com.example.senti_mate_back_end.exception.DuplicateResourceException;
import com.example.senti_mate_back_end.exception.ResourceNotFoundException;
import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        // Initialize test user
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .firstName("Test")
                .lastName("User")
                .isActive(true)
                .isEmailVerified(false)
                .build();

        // Initialize user role
        userRole = Role.builder()
                .id(1L)
                .name("USER")
                .description("Regular user role")
                .build();
    }

    @Test
    void findAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> expectedUsers = Arrays.asList(testUser, new User());
        when(userRepository.findAll()).thenReturn(expectedUsers);

        // When
        List<User> actualUsers = userService.findAllUsers();

        // Then
        assertEquals(expectedUsers.size(), actualUsers.size());
        assertEquals(expectedUsers, actualUsers);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void findById_WithExistingId_ShouldReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // Given
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findById(99L);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    void findByUsername_WithExistingUsername_ShouldReturnUser() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByUsername("testuser");

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnUser() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByEmail("test@example.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void createUser_WithValidUser_ShouldReturnCreatedUser() {
        // Given
        User newUser = User.builder()
                .username("newuser")
                .email("new@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.createUser(newUser);

        // Then
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("new@example.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());
        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_WithExistingUsername_ShouldThrowException() {
        // Given
        User newUser = User.builder()
                .username("existinguser")
                .email("new@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername("existinguser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_WithExistingEmail_ShouldThrowException() {
        // Given
        User newUser = User.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("password123")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(newUser);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("existing@example.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WithValidUser_ShouldReturnUpdatedUser() {
        // Given
        User existingUser = User.builder()
                .id(1L)
                .username("existinguser")
                .email("existing@example.com")
                .password("oldPassword")
                .firstName("Old")
                .lastName("Name")
                .build();

        User updatedDetails = User.builder()
                .firstName("New")
                .lastName("Name")
                .email("existing@example.com") // Same email
                .password("newPassword")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.updateUser(1L, updatedDetails);

        // Then
        assertNotNull(result);
        assertEquals("existinguser", result.getUsername()); // Username shouldn't change
        assertEquals("existing@example.com", result.getEmail());
        assertEquals("encodedNewPassword", result.getPassword());
        assertEquals("New", result.getFirstName());
        assertEquals("Name", result.getLastName());
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_WithExistingId_ShouldDeleteUser() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteUser_WithNonExistingId_ShouldThrowException() {
        // Given
        when(userRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.deleteUser(99L);
        });

        assertEquals("User not found with id: 99", exception.getMessage());
        verify(userRepository, times(1)).existsById(99L);
        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    void setUserActiveStatus_ShouldUpdateActiveStatus() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.setUserActiveStatus(1L, false);

        // Then
        assertNotNull(result);
        assertFalse(result.isActive());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void verifyUserEmail_ShouldUpdateEmailVerifiedStatus() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.verifyUserEmail(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmailVerified());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_WithRegisterRequest_ShouldReturnCreatedUser() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1!")).thenReturn("encodedPassword");
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(2L);
            return savedUser;
        });

        // When
        User result = userService.createUser(request);

        // Then
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("newuser", result.getUsername());
        assertEquals("new@example.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());
        assertEquals("New", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertTrue(result.isActive());
        assertFalse(result.isEmailVerified());
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertTrue(result.getRoles().contains(userRole));

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
        verify(passwordEncoder, times(1)).encode("Password1!");
        verify(roleRepository, times(1)).findByName("USER");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithUpdateUserRequest_ShouldReturnUpdatedUser() {
        // Given
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Updated")
                .lastName("Name")
                .email("updated@example.com")
                .password("NewPassword1!")
                .profilePicture("profile.jpg")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword1!")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.updateUser(1L, request);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername()); // Username shouldn't change
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("encodedNewPassword", result.getPassword());
        assertEquals("Updated", result.getFirstName());
        assertEquals("Name", result.getLastName());
        assertEquals("profile.jpg", result.getProfilePicture());

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).existsByEmail("updated@example.com");
        verify(passwordEncoder, times(1)).encode("NewPassword1!");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void validateUserRegistration_WithValidRequest_ShouldNotThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        // When & Then
        assertDoesNotThrow(() -> userService.validateUserRegistration(request));

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
    }

    @Test
    void validateUserRegistration_WithExistingUsername_ShouldThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("existinguser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> {
            userService.validateUserRegistration(request);
        });

        assertEquals("User already exists with username: existinguser", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("existinguser");
        verify(userRepository, never()).existsByEmail(anyString());
    }

    @Test
    void validateUserRegistration_WithExistingEmail_ShouldThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> {
            userService.validateUserRegistration(request);
        });

        assertEquals("User already exists with email: existing@example.com", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("existing@example.com");
    }

    @Test
    void assignDefaultRole_ShouldAddUserRole() {
        // Given
        User user = User.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .password("encodedPassword")
                .firstName("New")
                .lastName("User")
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>())
                .build();

        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));

        // When
        userService.assignDefaultRole(user);

        // Then
        assertNotNull(user.getRoles());
        assertEquals(1, user.getRoles().size());
        assertTrue(user.getRoles().contains(userRole));

        verify(roleRepository, times(1)).findByName("USER");
    }

    @Test
    void assignDefaultRole_WhenRoleNotFound_ShouldThrowException() {
        // Given
        User user = User.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .password("encodedPassword")
                .firstName("New")
                .lastName("User")
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>())
                .build();

        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            userService.assignDefaultRole(user);
        });

        assertEquals("Role not found with name: USER", exception.getMessage());

        verify(roleRepository, times(1)).findByName("USER");
    }

    @Test
    void createUser_WithRegisterRequest_ShouldReturnCreatedUser() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1!")).thenReturn("encodedPassword");
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(2L);
            return savedUser;
        });

        // When
        User result = userService.createUser(request);

        // Then
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("newuser", result.getUsername());
        assertEquals("new@example.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());
        assertEquals("New", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertTrue(result.isActive());
        assertFalse(result.isEmailVerified());
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertTrue(result.getRoles().contains(userRole));

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
        verify(passwordEncoder, times(1)).encode("Password1!");
        verify(roleRepository, times(1)).findByName("USER");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithUpdateUserRequest_ShouldReturnUpdatedUser() {
        // Given
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("Updated")
                .lastName("Name")
                .email("updated@example.com")
                .password("NewPassword1!")
                .profilePicture("profile.jpg")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword1!")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        User result = userService.updateUser(1L, request);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername()); // Username shouldn't change
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("encodedNewPassword", result.getPassword());
        assertEquals("Updated", result.getFirstName());
        assertEquals("Name", result.getLastName());
        assertEquals("profile.jpg", result.getProfilePicture());

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).existsByEmail("updated@example.com");
        verify(passwordEncoder, times(1)).encode("NewPassword1!");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void validateUserRegistration_WithValidRequest_ShouldNotThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        // When & Then
        assertDoesNotThrow(() -> userService.validateUserRegistration(request));

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
    }

    @Test
    void validateUserRegistration_WithExistingUsername_ShouldThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("existinguser")
                .email("new@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> {
            userService.validateUserRegistration(request);
        });

        assertEquals("User", exception.getResourceName());
        assertEquals("username", exception.getFieldName());
        assertEquals("existinguser", exception.getFieldValue());

        verify(userRepository, times(1)).existsByUsername("existinguser");
        verify(userRepository, never()).existsByEmail(anyString());
    }

    @Test
    void validateUserRegistration_WithExistingEmail_ShouldThrowException() {
        // Given
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("Password1!")
                .firstName("New")
                .lastName("User")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> {
            userService.validateUserRegistration(request);
        });

        assertEquals("User", exception.getResourceName());
        assertEquals("email", exception.getFieldName());
        assertEquals("existing@example.com", exception.getFieldValue());

        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("existing@example.com");
    }

    @Test
    void assignDefaultRole_ShouldAddUserRole() {
        // Given
        User user = User.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .password("encodedPassword")
                .firstName("New")
                .lastName("User")
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>())
                .build();

        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));

        // When
        userService.assignDefaultRole(user);

        // Then
        assertNotNull(user.getRoles());
        assertEquals(1, user.getRoles().size());
        assertTrue(user.getRoles().contains(userRole));

        verify(roleRepository, times(1)).findByName("USER");
    }

    @Test
    void assignDefaultRole_WhenRoleNotFound_ShouldThrowException() {
        // Given
        User user = User.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .password("encodedPassword")
                .firstName("New")
                .lastName("User")
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>())
                .build();

        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            userService.assignDefaultRole(user);
        });

        assertEquals("Role", exception.getResourceName());
        assertEquals("name", exception.getFieldName());
        assertEquals("USER", exception.getFieldValue());

        verify(roleRepository, times(1)).findByName("USER");
    }
}
