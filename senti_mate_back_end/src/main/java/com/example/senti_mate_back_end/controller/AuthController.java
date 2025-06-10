package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.service.UserService;
import com.example.senti_mate_back_end.util.SimplePasswordEncoder;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for authentication endpoints
 * Note: Spring Security has been removed, so this is a simplified version
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SimplePasswordEncoder passwordEncoder;

    /**
     * Login endpoint
     * Note: This is a simplified version without Spring Security
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // If email is provided but username is not, try to find the user by email
        if ((username == null || username.isEmpty()) && email != null && !email.isEmpty()) {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                username = userOpt.get().getUsername();
            } else {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: User not found with the provided email!"));
            }
        }

        // If neither username nor email is provided, return an error
        if ((username == null || username.isEmpty()) && (email == null || email.isEmpty())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username or email is required!"));
        }

        // Check if user exists and password matches
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid username or password!"));
        }

        // Get the authenticated user
        User authenticatedUser = userOpt.get();

        // Generate a simple token (in a real app, use a proper JWT library)
        String token = generateToken(authenticatedUser);

        // Return user data and token
        return ResponseEntity.ok(new LoginResponse(
                authenticatedUser.getId(),
                authenticatedUser.getUsername(),
                authenticatedUser.getEmail(),
                authenticatedUser.getFirstName(),
                authenticatedUser.getLastName(),
                token
        ));
    }

    /**
     * Register endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check if username is already taken
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(signUpRequest.getPassword())
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .isActive(true)
                .isEmailVerified(false)
                .build();

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                Role userRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + role + " is not found."));
                roles.add(userRole);
            });
        }

        user.setRoles(roles);
        userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User registered successfully!"));
    }

    // Updated LoginRequest to handle both email and username
    public static class LoginRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private Set<String> roles;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class LoginResponse {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String token;
        private Map<String, Object> user;

        public LoginResponse(Long id, String username, String email, String firstName, String lastName, String token) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.token = token;

            // Create a user object as a Map to match frontend expectations
            this.user = new HashMap<>();
            this.user.put("id", id);
            this.user.put("username", username);
            this.user.put("email", email);
            this.user.put("firstName", firstName != null ? firstName : "");
            this.user.put("lastName", lastName != null ? lastName : "");
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public Map<String, Object> getUser() {
            return user;
        }

        public void setUser(Map<String, Object> user) {
            this.user = user;
        }
    }

    /**
     * Generate a simple token for the user
     * In a real application, use a proper JWT library
     * @param user the user to generate a token for
     * @return the generated token
     */
    private String generateToken(User user) {
        // In a real application, use a proper JWT library
        // This is a simplified version for demonstration purposes
        String userInfo = user.getId() + ":" + user.getUsername() + ":" + 
                          user.getRoles().stream().map(Role::getName).collect(Collectors.joining(","));

        // Base64 encode the user info
        return Base64.getEncoder().encodeToString(userInfo.getBytes());
    }
}
