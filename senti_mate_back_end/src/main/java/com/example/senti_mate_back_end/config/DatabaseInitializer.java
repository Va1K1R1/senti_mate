package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.dto.request.RegisterRequest;
import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Database initializer to create default roles when the application starts
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

        // Create admin user if it doesn't exist
        createAdminUserIfNotFound();
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

    private void createAdminUserIfNotFound() {
        // Check if admin user exists
        if (!userService.existsByUsername("admin")) {
            try {
                // Create a set of roles for the admin user
                Set<String> adminRoles = new HashSet<>();
                adminRoles.add("USER");
                adminRoles.add("ADMIN");

                // Create admin user with RegisterRequest
                RegisterRequest adminRequest = RegisterRequest.builder()
                        .username("admin")
                        .email("admin@sentimate.com")
                        .password("Admin@123")
                        .firstName("Admin")
                        .lastName("User")
                        .roles(adminRoles)
                        .build();

                // Create user with admin role
                userService.createUser(adminRequest);

                System.out.println("Admin user created successfully");
            } catch (Exception e) {
                System.err.println("Error creating admin user: " + e.getMessage());
            }
        }
    }
}
