package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.UserController;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Adapter controller for user operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/users")
public class UserAdapter {

    private final UserController userController;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserAdapter(UserController userController, UserService userService, PasswordEncoder passwordEncoder) {
        this.userController = userController;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Get the current user's profile.
     * Maps to the backend's /api/users/{id} endpoint.
     *
     * @return the ResponseEntity with the user profile
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        Long userId = getCurrentUserId();
        return userController.getUserById(userId);
    }

    /**
     * Update the current user's profile.
     * Maps to the backend's /api/users/{id} endpoint.
     *
     * @param user the updated user profile
     * @return the ResponseEntity with the updated user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody User user) {
        Long userId = getCurrentUserId();
        
        // Ensure the ID in the path matches the ID in the request body
        user.setId(userId);
        
        return userController.updateUser(userId, user);
    }

    /**
     * Change the current user's password.
     * This is a custom endpoint not directly mapped to a backend endpoint.
     *
     * @param request the password change request
     * @return the ResponseEntity with a success message
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        Long userId = getCurrentUserId();
        User user = userService.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        // Verify the old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Current password is incorrect"));
        }
        
        // Update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.updateUser(userId, user);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    /**
     * Helper method to get the current user ID from the security context.
     *
     * @return the current user ID
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"))
                .getId();
    }

    /**
     * Request class for changing a user's password.
     */
    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}