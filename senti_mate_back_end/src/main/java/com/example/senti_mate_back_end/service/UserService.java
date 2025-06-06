package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.dto.request.RegisterRequest;
import com.example.senti_mate_back_end.dto.request.UpdateUserRequest;
import com.example.senti_mate_back_end.exception.DuplicateResourceException;
import com.example.senti_mate_back_end.exception.ResourceNotFoundException;
import com.example.senti_mate_back_end.exception.ValidationException;
import com.example.senti_mate_back_end.model.Role;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.RoleRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service for managing user operations
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    /**
     * Find all users
     * @return list of all users
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Find user by ID
     * @param id the user ID
     * @return an Optional containing the user if found, or empty if not found
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Find user by username
     * @param username the username
     * @return an Optional containing the user if found, or empty if not found
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Find user by email
     * @param email the email
     * @return an Optional containing the user if found, or empty if not found
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Check if username exists
     * @param username the username to check
     * @return true if the username exists, false otherwise
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Check if email exists
     * @param email the email to check
     * @return true if the email exists, false otherwise
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Create a new user
     * @param user the user to create
     * @return the created user
     * @throws DuplicateResourceException if the username or email already exists
     */
    @Transactional
    public User createUser(User user) {
        if (existsByUsername(user.getUsername())) {
            throw new DuplicateResourceException("User", "username", user.getUsername());
        }
        if (existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("User", "email", user.getEmail());
        }

        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    /**
     * Update an existing user
     * @param id the user ID
     * @param userDetails the updated user details
     * @return the updated user
     * @throws ResourceNotFoundException if the user is not found
     * @throws DuplicateResourceException if the email already exists
     */
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        // Update user fields
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setProfilePicture(userDetails.getProfilePicture());

        // Only update email if it's changed and doesn't already exist
        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty() && 
            !user.getEmail().equals(userDetails.getEmail())) {
            if (existsByEmail(userDetails.getEmail())) {
                throw new DuplicateResourceException("User", "email", userDetails.getEmail());
            }
            user.setEmail(userDetails.getEmail());
        }

        // Only update password if it's provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Delete a user
     * @param id the user ID
     * @throws ResourceNotFoundException if the user is not found
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Activate or deactivate a user
     * @param id the user ID
     * @param active the active status
     * @return the updated user
     * @throws ResourceNotFoundException if the user is not found
     */
    @Transactional
    public User setUserActiveStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        user.setActive(active);
        return userRepository.save(user);
    }

    /**
     * Verify user's email
     * @param id the user ID
     * @return the updated user
     * @throws ResourceNotFoundException if the user is not found
     */
    @Transactional
    public User verifyUserEmail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        user.setEmailVerified(true);
        return userRepository.save(user);
    }

    /**
     * Create a new user from RegisterRequest
     * @param request the registration request
     * @return the created user
     * @throws DuplicateResourceException if the username or email already exists
     * @throws ValidationException if the registration data is invalid
     */
    @Transactional
    public User createUser(RegisterRequest request) {
        // Validate registration data
        validateUserRegistration(request);

        // Create user entity
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .isActive(true)
                .isEmailVerified(false)
                .build();

        // Assign default role
        assignDefaultRole(user);

        // Save user
        return userRepository.save(user);
    }

    /**
     * Update an existing user from UpdateUserRequest
     * @param id the user ID
     * @param request the update request
     * @return the updated user
     * @throws ResourceNotFoundException if the user is not found
     * @throws DuplicateResourceException if the email already exists
     */
    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        // Update user fields if provided
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        // Only update email if it's changed and doesn't already exist
        if (request.getEmail() != null && !request.getEmail().isEmpty() && 
            !user.getEmail().equals(request.getEmail())) {
            if (existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("User", "email", request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        // Only update password if it's provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Validate user registration data
     * @param request the registration request
     * @throws DuplicateResourceException if the username or email already exists
     * @throws ValidationException if the registration data is invalid
     */
    public void validateUserRegistration(RegisterRequest request) {
        // Check for duplicate username
        if (existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Check for duplicate email
        if (existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Additional validation can be added here
    }

    /**
     * Assign default role to a user
     * @param user the user to assign role to
     * @throws ResourceNotFoundException if the default role is not found
     */
    public void assignDefaultRole(User user) {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
    }
}
