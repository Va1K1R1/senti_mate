package com.example.senti_mate_back_end.adapter;

import com.example.senti_mate_back_end.controller.AuthController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Convert email-based login to username-based login
        AuthController.LoginRequest backendLoginRequest = new AuthController.LoginRequest();
        backendLoginRequest.setUsername(loginRequest.getEmail());
        backendLoginRequest.setPassword(loginRequest.getPassword());

        return authController.authenticateUser(backendLoginRequest);
    }

    /**
     * Register endpoint that maps to the backend's /api/auth/register endpoint.
     *
     * @param signupRequest the signup request
     * @return the ResponseEntity with the registration response
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthController.SignupRequest signupRequest) {
        return authController.registerUser(signupRequest);
    }

    /**
     * Refresh token endpoint that maps to the backend's /api/auth/refresh endpoint.
     *
     * @param refreshTokenRequest the refresh token request
     * @return the ResponseEntity with the new tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody AuthController.RefreshTokenRequest refreshTokenRequest) {
        return authController.refreshToken(refreshTokenRequest);
    }

    /**
     * Frontend login request with email and password.
     */
    public static class LoginRequest {
        private String email;
        private String password;

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
}
