package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

/**
 * Database initializer to create default roles and demo user when the application starts
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserService userService;

    @Autowired
    public DatabaseInitializer(RoleRepository roleRepository, UserService userService) {
        this.roleRepository = roleRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        // Create default roles if they don't exist
        createRoleIfNotFound("USER", "Regular user role");
        createRoleIfNotFound("ADMIN", "Administrator role");
        createRoleIfNotFound("MODERATOR", "Moderator role");

        // Create demo user if it doesn't exist
        createDemoUserIfNotFound();
    }

    private void createRoleIfNotFound(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            roleRepository.save(role);
        }
    }

    private void createDemoUserIfNotFound() {
        String demoEmail = "user@example.com";

        // Check if demo user already exists
        if (!userService.existsByEmail(demoEmail)) {
            // Get the USER role
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Role 'USER' not found"));

            // Create the demo user
            User demoUser = User.builder()
                    .username("demouser")
                    .email(demoEmail)
                    .password("password") // Will be encoded by UserService.createUser
                    .firstName("Demo")
                    .lastName("User")
                    .isActive(true)
                    .isEmailVerified(true) // Pre-verify the demo user's email
                    .roles(new HashSet<>(Collections.singletonList(userRole)))
                    .build();

            // Save the user (UserService will encode the password)
            userService.createUser(demoUser);

            System.out.println("Demo user created with email: " + demoEmail + " and password: password");
        }
    }
}
