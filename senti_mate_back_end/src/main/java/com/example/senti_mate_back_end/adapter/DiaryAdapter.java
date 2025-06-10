package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.DiaryEntryController;
import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Adapter controller for diary entry operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/diary")
public class DiaryAdapter {

    private final DiaryEntryController diaryEntryController;
    private final UserService userService;

    @Autowired
    public DiaryAdapter(DiaryEntryController diaryEntryController, UserService userService) {
        this.diaryEntryController = diaryEntryController;
        this.userService = userService;
    }

    /**
     * Get all diary entries for the current user.
     * Maps to the backend's /api/diary-entries/user/{userId} endpoint.
     *
     * @return the ResponseEntity with the list of diary entries
     */
    @GetMapping
    public ResponseEntity<List<DiaryEntry>> getAllEntries() {
        Long userId = getCurrentUserId();
        return diaryEntryController.getAllDiaryEntriesByUser(userId);
    }

    /**
     * Get a specific diary entry by ID.
     * Maps to the backend's /api/diary-entries/{id} endpoint.
     *
     * @param id the ID of the diary entry
     * @return the ResponseEntity with the diary entry
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntry> getEntryById(@PathVariable Long id) {
        return diaryEntryController.getDiaryEntryById(id);
    }

    /**
     * Create a new diary entry for the current user.
     * Maps to the backend's /api/diary-entries/user/{userId} endpoint.
     *
     * @param diaryEntry the diary entry to create
     * @return the ResponseEntity with the created diary entry
     */
    @PostMapping
    public ResponseEntity<DiaryEntry> createEntry(@Valid @RequestBody DiaryEntry diaryEntry) {
        Long userId = getCurrentUserId();
        return diaryEntryController.createDiaryEntry(userId, diaryEntry);
    }

    /**
     * Update an existing diary entry.
     * Maps to the backend's /api/diary-entries/{id} endpoint.
     *
     * @param id the ID of the diary entry to update
     * @param diaryEntry the updated diary entry
     * @return the ResponseEntity with the updated diary entry
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntry> updateEntry(@PathVariable Long id, @Valid @RequestBody DiaryEntry diaryEntry) {
        return diaryEntryController.updateDiaryEntry(id, diaryEntry);
    }

    /**
     * Delete a diary entry.
     * Maps to the backend's /api/diary-entries/{id} endpoint.
     *
     * @param id the ID of the diary entry to delete
     * @return the ResponseEntity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        return diaryEntryController.deleteDiaryEntry(id);
    }

    /**
     * Get diary entries by date range for the current user.
     * Maps to the backend's /api/diary-entries/user/{userId}/filter/date endpoint.
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with the list of diary entries
     */
    @GetMapping("/range")
    public ResponseEntity<List<DiaryEntry>> getEntriesByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Long userId = getCurrentUserId();
        // The backend returns a Page, but we need a List to match the frontend expectation
        return ResponseEntity.ok(
                diaryEntryController.filterDiaryEntriesByDateRange(userId, startDate, endDate, null)
                        .getBody().getContent()
        );
    }

    /**
     * Helper method to get the current user ID.
     * Note: Spring Security has been removed, so this is a simplified version
     *
     * @return the current user ID
     */
    private Long getCurrentUserId() {
        // In a real application, you would get the user from the session or request
        // For now, we'll just return the first user we find
        return userService.findAllUsers()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No users found"))
                .getId();
    }
}
