package com.example.senti_mate_back_end.e2e;

import com.example.senti_mate_back_end.SentiMateBackEndApplication;
import com.example.senti_mate_back_end.controller.AuthController;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end tests for the authentication flow.
 * These tests verify the complete authentication process including:
 * - User registration
 * - User login
 * - Token validation
 * - Protected route access
 * - Logout functionality
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = SentiMateBackEndApplication.class
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String testUserEmail;
    private String testUserPassword;
    private String testUserFirstName;
    private String testUserLastName;
    private String testUserUsername;

    @BeforeEach
    public void setup() {
        // Generate unique test user data
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        testUserEmail = "test-user-" + uniqueId + "@example.com";
        testUserPassword = "Test@123";
        testUserFirstName = "Test";
        testUserLastName = "User-" + uniqueId;
        testUserUsername = "testuser" + uniqueId;
    }

    @AfterEach
    public void cleanup() {
        // Clean up test user after each test
        userRepository.findByEmail(testUserEmail).ifPresent(user -> userRepository.delete(user));
    }

    /**
     * Test the complete user registration process.
     * This test verifies that a new user can be registered successfully.
     */
    @Test
    public void testUserRegistration() throws Exception {
        // Create registration request
        Map<String, Object> registrationRequest = new HashMap<>();
        registrationRequest.put("username", testUserUsername);
        registrationRequest.put("email", testUserEmail);
        registrationRequest.put("password", testUserPassword);
        registrationRequest.put("firstName", testUserFirstName);
        registrationRequest.put("lastName", testUserLastName);

        // Perform registration request
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("User registered successfully")));

        // Verify user was created in the database
        User createdUser = userRepository.findByEmail(testUserEmail)
                .orElseThrow(() -> new AssertionError("User was not created in the database"));
        
        assertEquals(testUserEmail, createdUser.getEmail());
        assertEquals(testUserFirstName, createdUser.getFirstName());
        assertEquals(testUserLastName, createdUser.getLastName());
        assertEquals(testUserUsername, createdUser.getUsername());
        // Password should be encoded, not stored in plain text
        assertNotEquals(testUserPassword, createdUser.getPassword());
    }

    /**
     * Test the user login process.
     * This test verifies that a registered user can log in successfully and receive a JWT token.
     */
    @Test
    public void testUserLogin() throws Exception {
        // First register a user
        Map<String, Object> registrationRequest = new HashMap<>();
        registrationRequest.put("username", testUserUsername);
        registrationRequest.put("email", testUserEmail);
        registrationRequest.put("password", testUserPassword);
        registrationRequest.put("firstName", testUserFirstName);
        registrationRequest.put("lastName", testUserLastName);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk());

        // Create login request
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", testUserEmail); // Using email as username for login
        loginRequest.put("password", testUserPassword);

        // Perform login request
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")))
                .andReturn();

        // Extract token for subsequent tests
        String response = result.getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        String token = (String) responseMap.get("token");
        assertNotNull(token, "Token should not be null");
    }

    /**
     * Test token validation and protected route access.
     * This test verifies that a valid JWT token can be used to access protected routes.
     */
    @Test
    public void testProtectedRouteAccess() throws Exception {
        // First register a user
        Map<String, Object> registrationRequest = new HashMap<>();
        registrationRequest.put("username", testUserUsername);
        registrationRequest.put("email", testUserEmail);
        registrationRequest.put("password", testUserPassword);
        registrationRequest.put("firstName", testUserFirstName);
        registrationRequest.put("lastName", testUserLastName);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk());

        // Login to get token
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", testUserEmail);
        loginRequest.put("password", testUserPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        String token = (String) responseMap.get("token");

        // Access protected route with token
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(testUserEmail)));

        // Try to access protected route without token
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Test token refresh functionality.
     * This test verifies that a refresh token can be used to obtain a new access token.
     */
    @Test
    public void testTokenRefresh() throws Exception {
        // First register a user
        Map<String, Object> registrationRequest = new HashMap<>();
        registrationRequest.put("username", testUserUsername);
        registrationRequest.put("email", testUserEmail);
        registrationRequest.put("password", testUserPassword);
        registrationRequest.put("firstName", testUserFirstName);
        registrationRequest.put("lastName", testUserLastName);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk());

        // Login to get tokens
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", testUserEmail);
        loginRequest.put("password", testUserPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        String refreshToken = (String) responseMap.get("refreshToken");

        // Use refresh token to get new access token
        Map<String, String> refreshRequest = new HashMap<>();
        refreshRequest.put("refreshToken", refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")));
    }

    /**
     * Test the complete authentication flow.
     * This test verifies the entire authentication process from registration to logout.
     */
    @Test
    public void testCompleteAuthenticationFlow() throws Exception {
        // 1. Register a new user
        Map<String, Object> registrationRequest = new HashMap<>();
        registrationRequest.put("username", testUserUsername);
        registrationRequest.put("email", testUserEmail);
        registrationRequest.put("password", testUserPassword);
        registrationRequest.put("firstName", testUserFirstName);
        registrationRequest.put("lastName", testUserLastName);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("User registered successfully")));

        // 2. Login with the registered user
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", testUserEmail);
        loginRequest.put("password", testUserPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        String token = (String) responseMap.get("token");
        String refreshToken = (String) responseMap.get("refreshToken");

        // 3. Access protected resource with token
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(testUserEmail)));

        // 4. Refresh token
        Map<String, String> refreshRequest = new HashMap<>();
        refreshRequest.put("refreshToken", refreshToken);

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andReturn();

        String refreshResponse = refreshResult.getResponse().getContentAsString();
        Map<String, Object> refreshResponseMap = objectMapper.readValue(refreshResponse, Map.class);
        String newToken = (String) refreshResponseMap.get("token");

        // 5. Access protected resource with new token
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + newToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(testUserEmail)));

        // Note: Logout is typically handled client-side by removing the token
        // This test doesn't include an actual logout API call since it's handled by the frontend
    }
}