package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing user operations
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
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
}