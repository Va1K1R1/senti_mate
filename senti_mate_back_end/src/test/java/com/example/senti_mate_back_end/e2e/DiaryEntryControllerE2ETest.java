package com.example.senti_mate_back_end.e2e;

import com.example.senti_mate_back_end.SentiMateBackEndApplication;
import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.DiaryEntryRepository;
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
 * End-to-end tests for diary entry CRUD operations.
 * These tests verify the complete diary entry management process including:
 * - Creating a new diary entry
 * - Reading diary entries
 * - Updating an existing diary entry
 * - Deleting a diary entry
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = SentiMateBackEndApplication.class
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DiaryEntryControllerE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DiaryEntryRepository diaryEntryRepository;

    private User testUser;
    private String testUserEmail;
    private String testUserPassword;
    private String testUserFirstName;
    private String testUserLastName;
    private String testUserUsername;
    private String authToken;

    @BeforeEach
    public void setup() throws Exception {
        // Clean up any existing test data
        cleanup();

        // Generate unique test user data
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        testUserEmail = "test-user-" + uniqueId + "@example.com";
        testUserPassword = "Test@123";
        testUserFirstName = "Test";
        testUserLastName = "User-" + uniqueId;
        testUserUsername = "testuser" + uniqueId;

        // Register a test user
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

        // Login to get authentication token
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
        authToken = (String) responseMap.get("token");

        // Get the test user from the database
        testUser = userRepository.findByEmail(testUserEmail)
                .orElseThrow(() -> new AssertionError("Test user was not created in the database"));
    }

    @AfterEach
    public void cleanup() {
        // Delete all diary entries created by test users
        diaryEntryRepository.findAll().forEach(entry -> {
            if (entry.getUser() != null && entry.getUser().getEmail() != null && 
                entry.getUser().getEmail().startsWith("test-user-")) {
                diaryEntryRepository.delete(entry);
            }
        });

        // Delete all test users
        userRepository.findAll().forEach(user -> {
            if (user.getEmail() != null && user.getEmail().startsWith("test-user-")) {
                userRepository.delete(user);
            }
        });
    }

    /**
     * Test creating a new diary entry.
     * This test verifies that a new diary entry can be created successfully.
     */
    @Test
    public void testCreateDiaryEntry() throws Exception {
        // Create diary entry request
        Map<String, Object> diaryEntryRequest = new HashMap<>();
        diaryEntryRequest.put("title", "Test Diary Entry");
        diaryEntryRequest.put("content", "This is a test diary entry content.");
        diaryEntryRequest.put("moodScore", 8);
        diaryEntryRequest.put("energyLevel", 7);
        diaryEntryRequest.put("stressLevel", 3);
        diaryEntryRequest.put("sleepHours", 7.5);
        diaryEntryRequest.put("isPrivate", true);

        // Perform create diary entry request
        MvcResult result = mockMvc.perform(post("/api/diary-entries/user/" + testUser.getId())
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(diaryEntryRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Test Diary Entry")))
                .andExpect(jsonPath("$.content", is("This is a test diary entry content.")))
                .andExpect(jsonPath("$.moodScore", is(8)))
                .andExpect(jsonPath("$.energyLevel", is(7)))
                .andExpect(jsonPath("$.stressLevel", is(3)))
                .andExpect(jsonPath("$.sleepHours", is(7.5)))
                .andExpect(jsonPath("$.private", is(true)))
                .andReturn();

        // Extract diary entry ID for subsequent tests
        String response = result.getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        Integer diaryEntryId = (Integer) responseMap.get("id");
        assertNotNull(diaryEntryId, "Diary entry ID should not be null");

        // Verify diary entry was created in the database
        DiaryEntry createdEntry = diaryEntryRepository.findById(diaryEntryId.longValue())
                .orElseThrow(() -> new AssertionError("Diary entry was not created in the database"));
        
        assertEquals("Test Diary Entry", createdEntry.getTitle());
        assertEquals("This is a test diary entry content.", createdEntry.getContent());
        assertEquals(8, createdEntry.getMoodScore());
        assertEquals(7, createdEntry.getEnergyLevel());
        assertEquals(3, createdEntry.getStressLevel());
        assertEquals(7.5f, createdEntry.getSleepHours());
        assertTrue(createdEntry.isPrivate());
        assertEquals(testUser.getId(), createdEntry.getUser().getId());
    }

    /**
     * Test reading diary entries.
     * This test verifies that diary entries can be retrieved successfully.
     */
    @Test
    public void testReadDiaryEntries() throws Exception {
        // Create a diary entry first
        DiaryEntry diaryEntry = DiaryEntry.builder()
                .title("Test Diary Entry for Reading")
                .content("This is a test diary entry content for reading test.")
                .moodScore(9)
                .energyLevel(8)
                .stressLevel(2)
                .sleepHours(8.0f)
                .isPrivate(true)
                .user(testUser)
                .build();
        
        DiaryEntry savedEntry = diaryEntryRepository.save(diaryEntry);

        // Test getting all diary entries for the user
        mockMvc.perform(get("/api/diary-entries/user/" + testUser.getId())
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", is("Test Diary Entry for Reading")))
                .andExpect(jsonPath("$[0].content", is("This is a test diary entry content for reading test.")));

        // Test getting a specific diary entry by ID
        mockMvc.perform(get("/api/diary-entries/" + savedEntry.getId())
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(savedEntry.getId().intValue())))
                .andExpect(jsonPath("$.title", is("Test Diary Entry for Reading")))
                .andExpect(jsonPath("$.content", is("This is a test diary entry content for reading test.")))
                .andExpect(jsonPath("$.moodScore", is(9)))
                .andExpect(jsonPath("$.energyLevel", is(8)))
                .andExpect(jsonPath("$.stressLevel", is(2)))
                .andExpect(jsonPath("$.sleepHours", is(8.0)));
    }

    /**
     * Test updating an existing diary entry.
     * This test verifies that an existing diary entry can be updated successfully.
     */
    @Test
    public void testUpdateDiaryEntry() throws Exception {
        // Create a diary entry first
        DiaryEntry diaryEntry = DiaryEntry.builder()
                .title("Test Diary Entry for Updating")
                .content("This is a test diary entry content for updating test.")
                .moodScore(7)
                .energyLevel(6)
                .stressLevel(4)
                .sleepHours(6.5f)
                .isPrivate(true)
                .user(testUser)
                .build();
        
        DiaryEntry savedEntry = diaryEntryRepository.save(diaryEntry);

        // Create update request
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("title", "Updated Diary Entry");
        updateRequest.put("content", "This is an updated diary entry content.");
        updateRequest.put("moodScore", 9);
        updateRequest.put("energyLevel", 8);
        updateRequest.put("stressLevel", 2);
        updateRequest.put("sleepHours", 8.0);
        updateRequest.put("isPrivate", false);

        // Perform update request
        mockMvc.perform(put("/api/diary-entries/" + savedEntry.getId())
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(savedEntry.getId().intValue())))
                .andExpect(jsonPath("$.title", is("Updated Diary Entry")))
                .andExpect(jsonPath("$.content", is("This is an updated diary entry content.")))
                .andExpect(jsonPath("$.moodScore", is(9)))
                .andExpect(jsonPath("$.energyLevel", is(8)))
                .andExpect(jsonPath("$.stressLevel", is(2)))
                .andExpect(jsonPath("$.sleepHours", is(8.0)))
                .andExpect(jsonPath("$.private", is(false)));

        // Verify diary entry was updated in the database
        DiaryEntry updatedEntry = diaryEntryRepository.findById(savedEntry.getId())
                .orElseThrow(() -> new AssertionError("Diary entry was not found in the database"));
        
        assertEquals("Updated Diary Entry", updatedEntry.getTitle());
        assertEquals("This is an updated diary entry content.", updatedEntry.getContent());
        assertEquals(9, updatedEntry.getMoodScore());
        assertEquals(8, updatedEntry.getEnergyLevel());
        assertEquals(2, updatedEntry.getStressLevel());
        assertEquals(8.0f, updatedEntry.getSleepHours());
        assertFalse(updatedEntry.isPrivate());
    }

    /**
     * Test deleting a diary entry.
     * This test verifies that a diary entry can be deleted successfully.
     */
    @Test
    public void testDeleteDiaryEntry() throws Exception {
        // Create a diary entry first
        DiaryEntry diaryEntry = DiaryEntry.builder()
                .title("Test Diary Entry for Deleting")
                .content("This is a test diary entry content for deleting test.")
                .moodScore(6)
                .energyLevel(5)
                .stressLevel(5)
                .sleepHours(6.0f)
                .isPrivate(true)
                .user(testUser)
                .build();
        
        DiaryEntry savedEntry = diaryEntryRepository.save(diaryEntry);

        // Perform delete request
        mockMvc.perform(delete("/api/diary-entries/" + savedEntry.getId())
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        // Verify diary entry was deleted from the database
        assertFalse(diaryEntryRepository.existsById(savedEntry.getId()),
                "Diary entry should have been deleted from the database");
    }

    /**
     * Test the complete diary entry CRUD flow.
     * This test verifies the entire diary entry management process from creation to deletion.
     */
    @Test
    public void testCompleteDiaryEntryCRUDFlow() throws Exception {
        // 1. Create a new diary entry
        Map<String, Object> diaryEntryRequest = new HashMap<>();
        diaryEntryRequest.put("title", "Complete CRUD Test Entry");
        diaryEntryRequest.put("content", "This is a test entry for the complete CRUD flow.");
        diaryEntryRequest.put("moodScore", 8);
        diaryEntryRequest.put("energyLevel", 7);
        diaryEntryRequest.put("stressLevel", 3);
        diaryEntryRequest.put("sleepHours", 7.5);
        diaryEntryRequest.put("isPrivate", true);

        MvcResult createResult = mockMvc.perform(post("/api/diary-entries/user/" + testUser.getId())
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(diaryEntryRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Complete CRUD Test Entry")))
                .andReturn();

        String createResponse = createResult.getResponse().getContentAsString();
        Map<String, Object> createResponseMap = objectMapper.readValue(createResponse, Map.class);
        Integer diaryEntryId = (Integer) createResponseMap.get("id");
        assertNotNull(diaryEntryId, "Diary entry ID should not be null");

        // 2. Read the created diary entry
        mockMvc.perform(get("/api/diary-entries/" + diaryEntryId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(diaryEntryId)))
                .andExpect(jsonPath("$.title", is("Complete CRUD Test Entry")))
                .andExpect(jsonPath("$.content", is("This is a test entry for the complete CRUD flow.")));

        // 3. Update the diary entry
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("title", "Updated CRUD Test Entry");
        updateRequest.put("content", "This content has been updated for the CRUD flow test.");
        updateRequest.put("moodScore", 9);
        updateRequest.put("energyLevel", 8);
        updateRequest.put("stressLevel", 2);
        updateRequest.put("sleepHours", 8.0);
        updateRequest.put("isPrivate", false);

        mockMvc.perform(put("/api/diary-entries/" + diaryEntryId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(diaryEntryId)))
                .andExpect(jsonPath("$.title", is("Updated CRUD Test Entry")))
                .andExpect(jsonPath("$.content", is("This content has been updated for the CRUD flow test.")));

        // 4. Verify the update in the database
        DiaryEntry updatedEntry = diaryEntryRepository.findById(diaryEntryId.longValue())
                .orElseThrow(() -> new AssertionError("Diary entry was not found in the database"));
        
        assertEquals("Updated CRUD Test Entry", updatedEntry.getTitle());
        assertEquals("This content has been updated for the CRUD flow test.", updatedEntry.getContent());
        assertEquals(9, updatedEntry.getMoodScore());
        assertEquals(8, updatedEntry.getEnergyLevel());
        assertEquals(2, updatedEntry.getStressLevel());
        assertEquals(8.0f, updatedEntry.getSleepHours());
        assertFalse(updatedEntry.isPrivate());

        // 5. Delete the diary entry
        mockMvc.perform(delete("/api/diary-entries/" + diaryEntryId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNoContent());

        // 6. Verify the entry was deleted
        assertFalse(diaryEntryRepository.existsById(diaryEntryId.longValue()),
                "Diary entry should have been deleted from the database");

        // 7. Attempt to read the deleted entry (should return 404)
        mockMvc.perform(get("/api/diary-entries/" + diaryEntryId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }
}