package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.DiaryEntryService;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for managing diary entry operations
 */
@RestController
@RequestMapping("/api/diary")
public class DiaryEntryController {

    private final DiaryEntryService diaryEntryService;
    private final UserService userService;

    @Autowired
    public DiaryEntryController(DiaryEntryService diaryEntryService, UserService userService) {
        this.diaryEntryService = diaryEntryService;
        this.userService = userService;
    }

    /**
     * Get the current user ID from the authentication context
     * @return the current user ID
     * @throws IllegalStateException if the user is not authenticated or not found
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        String username = authentication.getName();
        return userService.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + username));
    }

    /**
     * GET /api/diary-entries/user/{userId} : Get all diary entries for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the list of diary entries in body
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DiaryEntry>> getAllDiaryEntriesByUser(@PathVariable Long userId) {
        try {
            List<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(userId);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /diary : Get all diary entries for the current user
     * @return the ResponseEntity with status 200 (OK) and the list of diary entries in body
     */
    @GetMapping
    public ResponseEntity<List<DiaryEntry>> getAllDiaryEntries() {
        try {
            Long userId = getCurrentUserId();
            List<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(userId);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/paged : Get all diary entries for a user with pagination
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of diary entries in body
     */
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<DiaryEntry>> getPagedDiaryEntriesByUser(
            @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(userId, pageable);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/diary-entries/{id} : Get the diary entry with the specified ID
     * @param id the ID of the diary entry to retrieve
     * @return the ResponseEntity with status 200 (OK) and the diary entry in body, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntry> getDiaryEntryById(@PathVariable Long id) {
        return diaryEntryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/diary-entries/user/{userId}/search/title : Search diary entries by title
     * @param userId the ID of the user
     * @param title the title search term
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of diary entries in body
     */
    @GetMapping("/user/{userId}/search/title")
    public ResponseEntity<Page<DiaryEntry>> searchDiaryEntriesByTitle(
            @PathVariable Long userId,
            @RequestParam String title,
            Pageable pageable) {
        try {
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByTitleContaining(userId, title, pageable);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/search/content : Search diary entries by content
     * @param userId the ID of the user
     * @param content the content search term
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of diary entries in body
     */
    @GetMapping("/user/{userId}/search/content")
    public ResponseEntity<Page<DiaryEntry>> searchDiaryEntriesByContent(
            @PathVariable Long userId,
            @RequestParam String content,
            Pageable pageable) {
        try {
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByContentContaining(userId, content, pageable);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/filter/date : Filter diary entries by date range
     * @param userId the ID of the user
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of diary entries in body
     */
    @GetMapping("/user/{userId}/filter/date")
    public ResponseEntity<Page<DiaryEntry>> filterDiaryEntriesByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        try {
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByDateRange(userId, startDate, endDate, pageable);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /diary/range : Get diary entries by date range for the current user
     * @param startDate the start date
     * @param endDate the end date
     * @return the ResponseEntity with status 200 (OK) and the list of diary entries in body
     */
    @GetMapping("/range")
    public ResponseEntity<List<DiaryEntry>> getDiaryEntriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long userId = getCurrentUserId();
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByDateRange(userId, startDate, endDate, Pageable.unpaged());
            return ResponseEntity.ok(diaryEntries.getContent());
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/filter/mood : Filter diary entries by mood score range
     * @param userId the ID of the user
     * @param minScore the minimum mood score
     * @param maxScore the maximum mood score
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the page of diary entries in body
     */
    @GetMapping("/user/{userId}/filter/mood")
    public ResponseEntity<Page<DiaryEntry>> filterDiaryEntriesByMoodScoreRange(
            @PathVariable Long userId,
            @RequestParam Integer minScore,
            @RequestParam Integer maxScore,
            Pageable pageable) {
        try {
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByMoodScoreRange(userId, minScore, maxScore, pageable);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/diary-entries/user/{userId} : Create a new diary entry
     * @param userId the ID of the user
     * @param diaryEntry the diary entry to create
     * @return the ResponseEntity with status 201 (Created) and the new diary entry in body
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<DiaryEntry> createDiaryEntry(
            @PathVariable Long userId,
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            DiaryEntry createdDiaryEntry = diaryEntryService.createDiaryEntry(userId, diaryEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiaryEntry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /diary : Create a new diary entry for the current user
     * @param diaryEntry the diary entry to create
     * @return the ResponseEntity with status 201 (Created) and the new diary entry in body
     */
    @PostMapping
    public ResponseEntity<DiaryEntry> createDiaryEntry(
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            Long userId = getCurrentUserId();
            DiaryEntry createdDiaryEntry = diaryEntryService.createDiaryEntry(userId, diaryEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiaryEntry);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/diary-entries/{id} : Update an existing diary entry
     * @param id the ID of the diary entry to update
     * @param diaryEntry the diary entry to update
     * @return the ResponseEntity with status 200 (OK) and the updated diary entry in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntry> updateDiaryEntry(
            @PathVariable Long id,
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            DiaryEntry updatedDiaryEntry = diaryEntryService.updateDiaryEntry(id, diaryEntry);
            return ResponseEntity.ok(updatedDiaryEntry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/diary-entries/{id} : Delete the diary entry with the specified ID
     * @param id the ID of the diary entry to delete
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiaryEntry(@PathVariable Long id) {
        try {
            diaryEntryService.deleteDiaryEntry(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/count : Count diary entries for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the count in body
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countDiaryEntriesByUser(@PathVariable Long userId) {
        try {
            long count = diaryEntryService.countByUser(userId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/diary-entries/user/{userId}/average-mood : Get average mood score for a user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the average mood score in body
     */
    @GetMapping("/user/{userId}/average-mood")
    public ResponseEntity<Double> getAverageMoodScore(@PathVariable Long userId) {
        Double averageMoodScore = diaryEntryService.getAverageMoodScore(userId);
        return ResponseEntity.ok(averageMoodScore);
    }
}
