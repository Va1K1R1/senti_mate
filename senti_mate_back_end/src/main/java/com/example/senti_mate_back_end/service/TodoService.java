package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.Todo;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.TodoRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing todo operations
 */
@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    /**
     * Find all todos for a user
     * @param userId the user ID
     * @return list of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public List<Todo> findAllByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUser(user);
    }

    /**
     * Find all todos for a user with pagination
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Todo> findAllByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUser(user, pageable);
    }

    /**
     * Find todo by ID
     * @param id the todo ID
     * @return an Optional containing the todo if found, or empty if not found
     */
    public Optional<Todo> findById(Long id) {
        return todoRepository.findById(id);
    }

    /**
     * Find todos by completion status
     * @param userId the user ID
     * @param completed the completion status
     * @return list of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public List<Todo> findByCompletionStatus(Long userId, boolean completed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUserAndCompleted(user, completed);
    }

    /**
     * Find todos by completion status with pagination
     * @param userId the user ID
     * @param completed the completion status
     * @param pageable pagination information
     * @return page of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Todo> findByCompletionStatus(Long userId, boolean completed, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUserAndCompleted(user, completed, pageable);
    }

    /**
     * Find todos by title containing search term
     * @param userId the user ID
     * @param title the title search term
     * @param pageable pagination information
     * @return page of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Todo> findByTitleContaining(Long userId, String title, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUserAndTitleContainingIgnoreCase(user, title, pageable);
    }

    /**
     * Find todos with due dates before a specified date
     * @param userId the user ID
     * @param dueDate the due date
     * @param pageable pagination information
     * @return page of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Todo> findByDueDateBefore(Long userId, LocalDateTime dueDate, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUserAndDueDateBefore(user, dueDate, pageable);
    }

    /**
     * Find todos with due dates after a specified date
     * @param userId the user ID
     * @param dueDate the due date
     * @param pageable pagination information
     * @return page of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public Page<Todo> findByDueDateAfter(Long userId, LocalDateTime dueDate, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.findByUserAndDueDateAfter(user, dueDate, pageable);
    }

    /**
     * Create a new todo
     * @param userId the user ID
     * @param todo the todo to create
     * @return the created todo
     * @throws IllegalArgumentException if the user is not found
     */
    @Transactional
    public Todo createTodo(Long userId, Todo todo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        todo.setUser(user);
        return todoRepository.save(todo);
    }

    /**
     * Update an existing todo
     * @param id the todo ID
     * @param todoDetails the updated todo details
     * @return the updated todo
     * @throws IllegalArgumentException if the todo is not found
     */
    @Transactional
    public Todo updateTodo(Long id, Todo todoDetails) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + id));

        // Update todo fields
        todo.setTitle(todoDetails.getTitle());
        todo.setDescription(todoDetails.getDescription());
        todo.setCompleted(todoDetails.isCompleted());
        todo.setDueDate(todoDetails.getDueDate());
        todo.setPriority(todoDetails.getPriority());

        return todoRepository.save(todo);
    }

    /**
     * Toggle the completion status of a todo
     * @param id the todo ID
     * @return the updated todo
     * @throws IllegalArgumentException if the todo is not found
     */
    @Transactional
    public Todo toggleTodoCompletion(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found with id: " + id));

        todo.setCompleted(!todo.isCompleted());
        return todoRepository.save(todo);
    }

    /**
     * Delete a todo
     * @param id the todo ID
     * @throws IllegalArgumentException if the todo is not found
     */
    @Transactional
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new IllegalArgumentException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }

    /**
     * Count todos for a user
     * @param userId the user ID
     * @return the number of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public long countByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.countByUser(user);
    }

    /**
     * Count todos for a user by completion status
     * @param userId the user ID
     * @param completed the completion status
     * @return the number of todos
     * @throws IllegalArgumentException if the user is not found
     */
    public long countByCompletionStatus(Long userId, boolean completed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return todoRepository.countByUserAndCompleted(user, completed);
    }
}
