package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.FileStorageService;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing user operations
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Autowired
    public UserController(UserService userService, FileStorageService fileStorageService) {
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    /**
     * GET /api/users : Get all users
     * @return the ResponseEntity with status 200 (OK) and the list of users in body
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id} : Get the user with the specified ID
     * @param id the ID of the user to retrieve
     * @return the ResponseEntity with status 200 (OK) and the user in body, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/users : Create a new user
     * @param user the user to create
     * @return the ResponseEntity with status 201 (Created) and the new user in body
     */
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/users/{id} : Update an existing user
     * @param id the ID of the user to update
     * @param user the user to update
     * @return the ResponseEntity with status 200 (OK) and the updated user in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/users/{id} : Delete the user with the specified ID
     * @param id the ID of the user to delete
     * @return the ResponseEntity with status 204 (NO_CONTENT)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/users/username/{username} : Get the user with the specified username
     * @param username the username of the user to retrieve
     * @return the ResponseEntity with status 200 (OK) and the user in body, or with status 404 (Not Found)
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/users/email/{email} : Get the user with the specified email
     * @param email the email of the user to retrieve
     * @return the ResponseEntity with status 200 (OK) and the user in body, or with status 404 (Not Found)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/users/{id}/active : Update the active status of a user
     * @param id the ID of the user to update
     * @param status the status map containing the active status
     * @return the ResponseEntity with status 200 (OK) and the updated user in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PatchMapping("/{id}/active")
    public ResponseEntity<User> updateUserActiveStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        try {
            Boolean isActive = status.get("active");
            if (isActive == null) {
                return ResponseEntity.badRequest().build();
            }

            User updatedUser = userService.setUserActiveStatus(id, isActive);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/users/{id}/verify-email : Verify the email of a user
     * @param id the ID of the user to update
     * @return the ResponseEntity with status 200 (OK) and the updated user in body, or with status 400 (Bad Request) if the ID is invalid
     */
    @PatchMapping("/{id}/verify-email")
    public ResponseEntity<User> verifyUserEmail(@PathVariable Long id) {
        try {
            User updatedUser = userService.verifyUserEmail(id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * HEAD /api/users/username/{username} : Check if a username exists
     * @param username the username to check
     * @return the ResponseEntity with status 200 (OK) if the username exists, or with status 404 (Not Found) if it doesn't
     */
    @RequestMapping(method = RequestMethod.HEAD, path = "/username/{username}")
    public ResponseEntity<Void> checkUsernameExists(@PathVariable String username) {
        return userService.existsByUsername(username)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    /**
     * HEAD /api/users/email/{email} : Check if an email exists
     * @param email the email to check
     * @return the ResponseEntity with status 200 (OK) if the email exists, or with status 404 (Not Found) if it doesn't
     */
    @RequestMapping(method = RequestMethod.HEAD, path = "/email/{email}")
    public ResponseEntity<Void> checkEmailExists(@PathVariable String email) {
        return userService.existsByEmail(email)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    /**
     * POST /api/users/{id}/profile-picture : Upload a profile picture for a user
     * @param id the ID of the user
     * @param file the profile picture file
     * @return the ResponseEntity with status 200 (OK) and the updated user in body, 
     *         or with status 400 (Bad Request) if the ID is invalid,
     *         or with status 500 (Internal Server Error) if an I/O error occurs
     */
    @PostMapping(value = "/{id}/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            User updatedUser = userService.uploadProfilePicture(id, file);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/users/{id}/profile-picture : Get the profile picture of a user
     * @param id the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the profile picture as Resource,
     *         or with status 404 (Not Found) if the user or profile picture is not found
     */
    @GetMapping("/{id}/profile-picture")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable Long id) {
        try {
            // Find the user
            User user = userService.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

            // Check if user has a profile picture
            if (user.getProfilePicture() == null || user.getProfilePicture().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Get the file path
            Path filePath = fileStorageService.getFilePath(user.getProfilePicture());
            Resource resource = new UrlResource(filePath.toUri());

            // Check if file exists
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type
            String contentType = determineContentType(user.getProfilePicture());

            // Return the resource
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IllegalArgumentException | MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Determine the content type based on file extension
     * @param fileName the file name
     * @return the content type
     */
    private String determineContentType(String fileName) {
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
        }
    }
}
