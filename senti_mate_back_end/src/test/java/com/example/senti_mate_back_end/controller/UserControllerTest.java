package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(UserControllerTestConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
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
    }

    @Test
    void getAllUsers_ShouldReturnUsers() throws Exception {
        // Given
        when(userService.findAllUsers()).thenReturn(Arrays.asList(testUser, new User()));

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].username", is("testuser")))
                .andExpect(jsonPath("$[0].email", is("test@example.com")));

        verify(userService, times(1)).findAllUsers();
    }

    @Test
    void getUserById_WithExistingId_ShouldReturnUser() throws Exception {
        // Given
        when(userService.findById(1L)).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.email", is("test@example.com")));

        verify(userService, times(1)).findById(1L);
    }

    @Test
    void getUserById_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).findById(99L);
    }

    @Test
    void createUser_WithValidUser_ShouldReturnCreatedUser() throws Exception {
        // Given
        User newUser = User.builder()
                .username("newuser")
                .email("new@example.com")
                .password("password123")
                .build();

        User createdUser = User.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .password("encodedPassword")
                .build();

        when(userService.createUser(any(User.class))).thenReturn(createdUser);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.username", is("newuser")))
                .andExpect(jsonPath("$.email", is("new@example.com")));

        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void createUser_WithExistingUsername_ShouldReturnBadRequest() throws Exception {
        // Given
        User newUser = User.builder()
                .username("existinguser")
                .email("new@example.com")
                .password("password123")
                .build();

        when(userService.createUser(any(User.class))).thenThrow(new IllegalArgumentException("Username already exists"));

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isBadRequest());

        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void updateUser_WithValidUser_ShouldReturnUpdatedUser() throws Exception {
        // Given
        User updatedDetails = User.builder()
                .firstName("Updated")
                .lastName("Name")
                .email("test@example.com")
                .password("newPassword")
                .build();

        User updatedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedNewPassword")
                .firstName("Updated")
                .lastName("Name")
                .isActive(true)
                .isEmailVerified(false)
                .build();

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.firstName", is("Updated")))
                .andExpect(jsonPath("$.lastName", is("Name")));

        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }

    @Test
    void updateUser_WithNonExistingId_ShouldReturnBadRequest() throws Exception {
        // Given
        User updatedDetails = User.builder()
                .firstName("Updated")
                .lastName("Name")
                .build();

        when(userService.updateUser(eq(99L), any(User.class))).thenThrow(new IllegalArgumentException("User not found"));

        // When & Then
        mockMvc.perform(put("/api/users/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isBadRequest());

        verify(userService, times(1)).updateUser(eq(99L), any(User.class));
    }

    @Test
    void deleteUser_WithExistingId_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(1L);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    void deleteUser_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new IllegalArgumentException("User not found")).when(userService).deleteUser(99L);

        // When & Then
        mockMvc.perform(delete("/api/users/99"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).deleteUser(99L);
    }

    @Test
    void getUserByUsername_WithExistingUsername_ShouldReturnUser() throws Exception {
        // Given
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(get("/api/users/username/testuser"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.email", is("test@example.com")));

        verify(userService, times(1)).findByUsername("testuser");
    }

    @Test
    void getUserByEmail_WithExistingEmail_ShouldReturnUser() throws Exception {
        // Given
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(get("/api/users/email/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.email", is("test@example.com")));

        verify(userService, times(1)).findByEmail("test@example.com");
    }

    @Test
    void updateUserActiveStatus_WithValidStatus_ShouldReturnUpdatedUser() throws Exception {
        // Given
        Map<String, Boolean> status = new HashMap<>();
        status.put("active", false);

        User updatedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .isActive(false)
                .build();

        when(userService.setUserActiveStatus(eq(1L), eq(false))).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(patch("/api/users/1/active")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(status)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.active", is(false)));

        verify(userService, times(1)).setUserActiveStatus(eq(1L), eq(false));
    }

    @Test
    void verifyUserEmail_ShouldReturnUpdatedUser() throws Exception {
        // Given
        User updatedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .isEmailVerified(true)
                .build();

        when(userService.verifyUserEmail(1L)).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(patch("/api/users/1/verify-email"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.emailVerified", is(true)));

        verify(userService, times(1)).verifyUserEmail(1L);
    }

    @Test
    void checkUsernameExists_WithExistingUsername_ShouldReturnOk() throws Exception {
        // Given
        when(userService.existsByUsername("testuser")).thenReturn(true);

        // When & Then
        mockMvc.perform(head("/api/users/username/testuser"))
                .andExpect(status().isOk());

        verify(userService, times(1)).existsByUsername("testuser");
    }

    @Test
    void checkUsernameExists_WithNonExistingUsername_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.existsByUsername("nonexistinguser")).thenReturn(false);

        // When & Then
        mockMvc.perform(head("/api/users/username/nonexistinguser"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).existsByUsername("nonexistinguser");
    }

    @Test
    void checkEmailExists_WithExistingEmail_ShouldReturnOk() throws Exception {
        // Given
        when(userService.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        mockMvc.perform(head("/api/users/email/test@example.com"))
                .andExpect(status().isOk());

        verify(userService, times(1)).existsByEmail("test@example.com");
    }
}
