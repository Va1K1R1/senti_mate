package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.AuthController;
import com.example.senti_mate_back_end.dto.request.FrontendLoginRequest;
import com.example.senti_mate_back_end.dto.request.LoginRequest;
import com.example.senti_mate_back_end.dto.request.RefreshTokenRequest;
import com.example.senti_mate_back_end.dto.request.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Adapter controller for authentication operations.
 * Maps frontend API expectations to backend implementations.
 */
@RestController
@RequestMapping("/auth")
public class AuthAdapter {

    private final AuthController authController;

    @Autowired
    public AuthAdapter(AuthController authController) {
        this.authController = authController;
    }

    /**
     * Login endpoint that accepts email instead of username.
     * Maps to the backend's /api/auth/login endpoint.
     *
     * @param loginRequest the login request with email and password
     * @return the ResponseEntity with the authentication response
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody FrontendLoginRequest loginRequest) {
        // Convert email-based login to username-based login
        LoginRequest backendLoginRequest = LoginRequest.builder()
                .email(loginRequest.getEmail())
                .password(loginRequest.getPassword())
                .build();

        return authController.authenticateUser(backendLoginRequest);
    }

    /**
     * Register endpoint that maps to the backend's /api/auth/register endpoint.
     *
     * @param registerRequest the registration request
     * @return the ResponseEntity with the registration response
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return authController.registerUser(registerRequest);
    }

    /**
     * Refresh token endpoint that maps to the backend's /api/auth/refresh endpoint.
     *
     * @param refreshTokenRequest the refresh token request
     * @return the ResponseEntity with the new tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return authController.refreshToken(refreshTokenRequest);
    }
}