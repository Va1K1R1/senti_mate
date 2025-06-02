package com.example.senti_mate_back_end.config;

import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Database initializer to create default roles when the application starts
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Autowired
    public DatabaseInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Create default roles if they don't exist
        createRoleIfNotFound("USER", "Regular user role");
        createRoleIfNotFound("ADMIN", "Administrator role");
        createRoleIfNotFound("MODERATOR", "Moderator role");
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
}