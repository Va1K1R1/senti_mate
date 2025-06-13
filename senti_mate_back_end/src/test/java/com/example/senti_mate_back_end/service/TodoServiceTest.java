package com.example.senti_mate_back_end.service;

import com.example.senti_mate_back_end.model.Todo;
import com.example.senti_mate_back_end.model.User;
import com.example.senti_mate_back_end.repository.TodoRepository;
import com.example.senti_mate_back_end.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TodoService todoService;

    private User testUser;
    private Todo testTodo;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();

        testTodo = Todo.builder()
                .id(1L)
                .title("Test Todo")
                .description("Test Description")
                .completed(false)
                .dueDate(now.plusDays(1))
                .priority(1)
                .user(testUser)
                .build();
    }

    @Test
    void findAllByUser_ShouldReturnTodoList() {
        // Given
        List<Todo> expectedTodos = Arrays.asList(testTodo, new Todo());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(todoRepository.findByUser(testUser)).thenReturn(expectedTodos);

        // When
        List<Todo> actualTodos = todoService.findAllByUser(1L);

        // Then
        assertEquals(expectedTodos.size(), actualTodos.size());
        assertEquals(expectedTodos, actualTodos);
        verify(userRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).findByUser(testUser);
    }

    @Test
    void findAllByUser_WithPagination_ShouldReturnTodoPage() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Todo> todoList = Arrays.asList(testTodo, new Todo());
        Page<Todo> expectedPage = new PageImpl<>(todoList, pageable, todoList.size());
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(todoRepository.findByUser(testUser, pageable)).thenReturn(expectedPage);

        // When
        Page<Todo> actualPage = todoService.findAllByUser(1L, pageable);

        // Then
        assertEquals(expectedPage.getTotalElements(), actualPage.getTotalElements());
        assertEquals(expectedPage.getContent(), actualPage.getContent());
        verify(userRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).findByUser(testUser, pageable);
    }

    @Test
    void findById_WithExistingId_ShouldReturnTodo() {
        // Given
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));

        // When
        Optional<Todo> result = todoService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testTodo, result.get());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    void createTodo_ShouldReturnCreatedTodo() {
        // Given
        Todo newTodo = Todo.builder()
                .title("New Todo")
                .description("New Description")
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Todo result = todoService.createTodo(1L, newTodo);

        // Then
        assertNotNull(result);
        assertEquals("New Todo", result.getTitle());
        assertEquals("New Description", result.getDescription());
        assertEquals(testUser, result.getUser());
        verify(userRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void updateTodo_ShouldReturnUpdatedTodo() {
        // Given
        Todo updatedTodo = Todo.builder()
                .title("Updated Todo")
                .description("Updated Description")
                .completed(true)
                .dueDate(now.plusDays(2))
                .priority(2)
                .build();
        
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Todo result = todoService.updateTodo(1L, updatedTodo);

        // Then
        assertNotNull(result);
        assertEquals("Updated Todo", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertTrue(result.isCompleted());
        assertEquals(now.plusDays(2), result.getDueDate());
        assertEquals(2, result.getPriority());
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void toggleTodoCompletion_ShouldToggleCompletionStatus() {
        // Given
        when(todoRepository.findById(1L)).thenReturn(Optional.of(testTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Todo result = todoService.toggleTodoCompletion(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.isCompleted()); // Should be toggled from false to true
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void deleteTodo_ShouldDeleteTodo() {
        // Given
        when(todoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(todoRepository).deleteById(1L);

        // When
        todoService.deleteTodo(1L);

        // Then
        verify(todoRepository, times(1)).existsById(1L);
        verify(todoRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteTodo_WithNonExistingId_ShouldThrowException() {
        // Given
        when(todoRepository.existsById(99L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            todoService.deleteTodo(99L);
        });

        assertEquals("Todo not found with id: 99", exception.getMessage());
        verify(todoRepository, times(1)).existsById(99L);
        verify(todoRepository, never()).deleteById(anyLong());
    }
}