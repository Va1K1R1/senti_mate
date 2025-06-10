package com.example.senti_mate_back_end.controller;

import com.example.senti_mate_back_end.model.Todo;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.service.TodoService;
import com.example.senti_mate_back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing todo operations
 */
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    @Autowired
    public TodoController(TodoService todoService, UserService userService) {
        this.todoService = todoService;
        this.userService = userService;
    }

    /**
     * Get the current user ID.
     * Note: Spring Security has been removed, so this is a simplified version
     * @return the current user ID
     * @throws IllegalStateException if no users are found
     */
    private Long getCurrentUserId() {
        // In a real application, you would get the user from the session or request
        // For now, we'll just return the first user we find
        return userService.findAllUsers()
                .stream()
                .findFirst()
                .map(User::getId)
                .orElseThrow(() -> new IllegalStateException("No users found"));
    }

    /**
     * GET /api/todos : Get all todos for a user
     * @param userId the ID of the user (optional, will use current user if not provided)
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of todos
     */
    @GetMapping
    public ResponseEntity<Page<Todo>> getAllTodos(
            @RequestParam(required = false) Long userId,
            Pageable pageable) {
        try {
            // If userId is not provided, use the current user
            if (userId == null) {
                userId = getCurrentUserId();
            }
            Page<Todo> todos = todoService.findAllByUser(userId, pageable);
            return ResponseEntity.ok(todos);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/todos/{id} : Get todo by ID
     * @param id the ID of the todo
     * @return the ResponseEntity with status 200 (OK) and the todo, or with status 404 (Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/todos/user/{userId} : Get all todos for a specific user
     * @param userId the ID of the user
     * @return the ResponseEntity with status 200 (OK) and the list of todos
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Todo>> getTodosByUserId(@PathVariable Long userId) {
        try {
            List<Todo> todos = todoService.findAllByUser(userId);
            return ResponseEntity.ok(todos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/todos/user/{userId}/completed : Get completed todos for a user
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of completed todos
     */
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<Page<Todo>> getCompletedTodos(
            @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<Todo> todos = todoService.findByCompletionStatus(userId, true, pageable);
            return ResponseEntity.ok(todos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/todos/user/{userId}/incomplete : Get incomplete todos for a user
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of incomplete todos
     */
    @GetMapping("/user/{userId}/incomplete")
    public ResponseEntity<Page<Todo>> getIncompleteTodos(
            @PathVariable Long userId,
            Pageable pageable) {
        try {
            Page<Todo> todos = todoService.findByCompletionStatus(userId, false, pageable);
            return ResponseEntity.ok(todos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/todos : Create a new todo
     * @param userId the ID of the user
     * @param todo the todo to create
     * @return the ResponseEntity with status 201 (Created) and the new todo
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(
            @RequestParam Long userId,
            @RequestBody Todo todo) {
        try {
            Todo createdTodo = todoService.createTodo(userId, todo);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/todos/user/{userId} : Create a new todo for a specific user
     * @param userId the ID of the user
     * @param todo the todo to create
     * @return the ResponseEntity with status 201 (Created) and the new todo
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<Todo> createTodoForUser(
            @PathVariable Long userId,
            @RequestBody Todo todo) {
        try {
            Todo createdTodo = todoService.createTodo(userId, todo);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/todos/{id} : Update a todo
     * @param id the ID of the todo
     * @param todo the todo to update
     * @return the ResponseEntity with status 200 (OK) and the updated todo, or with status 400 (Bad Request)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(
            @PathVariable Long id,
            @RequestBody Todo todo) {
        try {
            Todo updatedTodo = todoService.updateTodo(id, todo);
            return ResponseEntity.ok(updatedTodo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PATCH /api/todos/{id}/toggle : Toggle the completion status of a todo
     * @param id the ID of the todo
     * @return the ResponseEntity with status 200 (OK) and the updated todo, or with status 400 (Bad Request)
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodoCompletion(@PathVariable Long id) {
        try {
            Todo updatedTodo = todoService.toggleTodoCompletion(id);
            return ResponseEntity.ok(updatedTodo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/todos/{id} : Delete a todo
     * @param id the ID of the todo
     * @return the ResponseEntity with status 204 (No Content), or with status 400 (Bad Request)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        try {
            todoService.deleteTodo(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
// Add this to your TodoController
@GetMapping("/user/{userId}/list")
public ResponseEntity<List<Todo>> getTodosListByUserId(@PathVariable Long userId) {
    try {
        // Use unpaged to get all results
        Page<Todo> todosPage = todoService.findAllByUser(userId, Pageable.unpaged());
        List<Todo> todos = todosPage.getContent();
        return ResponseEntity.ok(todos);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
    }
}
}