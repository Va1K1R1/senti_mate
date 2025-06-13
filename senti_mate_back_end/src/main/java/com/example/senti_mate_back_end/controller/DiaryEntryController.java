package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.DiaryEntry;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.DiaryEntryService;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for managing diary entry operations
 */
@RestController
@RequestMapping("/api/diary-entries")  // Changed from "/diary-entries"
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class DiaryEntryController {

    private final DiaryEntryService diaryEntryService;
    private final UserService userService;

    @Autowired
    public DiaryEntryController(DiaryEntryService diaryEntryService, UserService userService) {
        this.diaryEntryService = diaryEntryService;
        this.userService = userService;
    }

        /**
         * Get the current user ID from various sources
         * @param request the HTTP request
         * @param userIdParam optional user ID parameter (for testing)
         * @return the current user ID
         * @throws IllegalStateException if user is not authenticated
         */
        private Long getCurrentUserId(HttpServletRequest request, Long userIdParam) {
            // For development/testing: allow user ID as parameter
            if (userIdParam != null) {
                return userIdParam;
            }

            // Production: get from session
            HttpSession session = request.getSession(false);
            if (session != null) {
                Long userId = (Long) session.getAttribute("userId");
                if (userId != null) {
                    return userId;
                }
            }

            // Alternative: get from header
            String userIdHeader = request.getHeader("X-User-Id");
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                try {
                    return Long.parseLong(userIdHeader);
                } catch (NumberFormatException e) {
                    throw new IllegalStateException("Invalid user ID in header");
                }
            }

            throw new IllegalStateException("User not authenticated");
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
    public ResponseEntity<List<DiaryEntry>> getAllDiaryEntries(
            HttpServletRequest request,
            @RequestParam(required = false) Long userId) {
        try {
            Long currentUserId = getCurrentUserId(request, userId);
            List<DiaryEntry> diaryEntries = diaryEntryService.findAllByUser(currentUserId);
            return ResponseEntity.ok(diaryEntries);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
        // Validate id parameter
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

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
            HttpServletRequest request,
            @RequestParam(required = false) Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            Long currentUserId = getCurrentUserId(request, userId);
            Page<DiaryEntry> diaryEntries = diaryEntryService.findByDateRange(currentUserId, startDate, endDate, Pageable.unpaged());
            return ResponseEntity.ok(diaryEntries.getContent());
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
 * POST /api/diary-entries/user/{userId} : Create a new diary entry for a user
 * @param userId the ID of the user
 * @param diaryEntry the diary entry to create
 * @return the ResponseEntity with status 201 (Created) and the diary entry in body
 */
@PostMapping("/user/{userId}")
public ResponseEntity<DiaryEntry> createDiaryEntry(@PathVariable Long userId, @Valid @RequestBody DiaryEntry diaryEntry) {
    try {
        DiaryEntry createdDiaryEntry = diaryEntryService.createDiaryEntry(userId, diaryEntry);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiaryEntry);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    /**
     * POST /diary : Create a new diary entry for the current user
     * @param diaryEntry the diary entry to create
     * @return the ResponseEntity with status 201 (Created) and the new diary entry in body
     */
    @PostMapping
    public ResponseEntity<DiaryEntry> createDiaryEntry(
            HttpServletRequest request,
            @RequestParam(required = false) Long userId,
            @Valid @RequestBody DiaryEntry diaryEntry) {
        try {
            Long currentUserId = getCurrentUserId(request, userId);
            DiaryEntry createdDiaryEntry = diaryEntryService.createDiaryEntry(currentUserId, diaryEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiaryEntry);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
