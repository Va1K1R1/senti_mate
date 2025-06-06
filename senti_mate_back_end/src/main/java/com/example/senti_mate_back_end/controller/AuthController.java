package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.config.JwtTokenProvider;
import com.example.senti_mate_back_end.dto.request.LoginRequest;
import com.example.senti_mate_back_end.dto.request.RefreshTokenRequest;
import com.example.senti_mate_back_end.dto.request.RegisterRequest;
import com.example.senti_mate_back_end.dto.response.JwtAuthenticationResponse;
import com.example.senti_mate_back_end.dto.response.MessageResponse;
import com.example.senti_mate_back_end.exception.DuplicateResourceException;
import com.example.senti_mate_back_end.exception.ResourceNotFoundException;
import com.example.senti_mate_back_end.exception.UnauthorizedException;
import com.example.senti_mate_back_end.exception.ValidationException;
import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

/**
 * Controller for authentication operations
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Authenticate user and generate JWT token
     *
     * @param loginRequest the login request with username/email and password
     * @return JWT authentication response with tokens and user info
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String email = loginRequest.getEmail();

        // If email is provided but username is not, try to find the user by email
        if ((username == null || username.isEmpty()) && email != null && !email.isEmpty()) {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                username = userOpt.get().getUsername();
            } else {
                throw new ResourceNotFoundException("User", "email", email);
            }
        }

        // If neither username nor email is provided, return an error
        if ((username == null || username.isEmpty()) && (email == null || email.isEmpty())) {
            throw new ValidationException("username/email", "Username or email is required");
        }

        // Store the final username for use in lambda expressions
        final String finalUsername = username;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        finalUsername,
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        // Generate refresh token
        String refreshToken = tokenProvider.generateRefreshToken(finalUsername);
        
        // Get user information
        User user = userService.findByUsername(finalUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", finalUsername));

        // Build response with user information
        JwtAuthenticationResponse response = JwtAuthenticationResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .user(JwtAuthenticationResponse.UserInfo.fromUser(user))
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Refresh JWT token using refresh token
     *
     * @param refreshTokenRequest the refresh token request
     * @return new JWT authentication response with new tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        // Validate refresh token
        String refreshToken = refreshTokenRequest.getRefreshToken();
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        // Get username from refresh token
        String username = tokenProvider.getUsernameFromRefreshToken(refreshToken);

        // Generate new access token
        String newAccessToken = tokenProvider.generateToken(username);

        // Generate new refresh token
        String newRefreshToken = tokenProvider.generateRefreshToken(username);
        
        // Get user information
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Build response with user information
        JwtAuthenticationResponse response = JwtAuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(JwtAuthenticationResponse.UserInfo.fromUser(user))
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Register a new user
     *
     * @param registerRequest the registration request
     * @return success message if registration is successful
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if username is already taken
        if (userService.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("User", "username", registerRequest.getUsername());
        }

        // Check if email is already in use
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("User", "email", registerRequest.getEmail());
        }

        // Create new user's account
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .isActive(true)
                .isEmailVerified(false)
                .build();

        Set<String> strRoles = registerRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                Role userRole = roleRepository.findByName(role)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", role));
                roles.add(userRole);
            });
        }

        user.setRoles(roles);
        userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User registered successfully!"));
    }
}