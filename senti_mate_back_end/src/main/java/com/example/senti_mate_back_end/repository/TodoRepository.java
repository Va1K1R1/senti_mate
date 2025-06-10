package com.example.senti_mate_back_end.repository;

import com.example.senti_mate_back_end.model.Todo;
import com.example.senti_mate_back_end.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Todo entity
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    /**
     * Find all todos by user
     * @param user the user to search for
     * @return a list of todos for the user
     */
    List<Todo> findByUser(User user);

    /**
     * Find all todos by user with pagination
     * @param user the user to search for
     * @param pageable pagination information
     * @return a page of todos for the user
     */
    Page<Todo> findByUser(User user, Pageable pageable);

    /**
     * Find all todos by user and completion status
     * @param user the user to search for
     * @param completed the completion status
     * @return a list of todos for the user with the specified completion status
     */
    List<Todo> findByUserAndCompleted(User user, boolean completed);

    /**
     * Find all todos by user and completion status with pagination
     * @param user the user to search for
     * @param completed the completion status
     * @param pageable pagination information
     * @return a page of todos for the user with the specified completion status
     */
    Page<Todo> findByUserAndCompleted(User user, boolean completed, Pageable pageable);

    /**
     * Find all todos by user and title containing
     * @param user the user to search for
     * @param title the title to search for
     * @param pageable pagination information
     * @return a page of todos for the user with titles containing the search term
     */
    Page<Todo> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);

    /**
     * Find all todos by user and due date before
     * @param user the user to search for
     * @param dueDate the due date
     * @param pageable pagination information
     * @return a page of todos for the user with due dates before the specified date
     */
    Page<Todo> findByUserAndDueDateBefore(User user, LocalDateTime dueDate, Pageable pageable);

    /**
     * Find all todos by user and due date after
     * @param user the user to search for
     * @param dueDate the due date
     * @param pageable pagination information
     * @return a page of todos for the user with due dates after the specified date
     */
    Page<Todo> findByUserAndDueDateAfter(User user, LocalDateTime dueDate, Pageable pageable);

    /**
     * Count todos by user
     * @param user the user to count for
     * @return the number of todos for the user
     */
    long countByUser(User user);

    /**
     * Count todos by user and completion status
     * @param user the user to count for
     * @param completed the completion status
     * @return the number of todos for the user with the specified completion status
     */
    long countByUserAndCompleted(User user, boolean completed);
}
