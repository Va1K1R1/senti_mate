package com.example.senti_mate_back_end.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a user is not authorized to access a resource
 */
public class UnauthorizedException extends BaseException {
    
    private static final HttpStatus STATUS = HttpStatus.UNAUTHORIZED;
    private static final String ERROR_CODE = "UNAUTHORIZED";
    
    /**
     * Constructor with resource name and user
     * 
     * @param resourceName the name of the resource
     * @param username the username of the user
     */
    public UnauthorizedException(String resourceName, String username) {
        super(String.format("User %s is not authorized to access %s", username, resourceName), STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message
     * 
     * @param message the error message
     */
    public UnauthorizedException(String message) {
        super(message, STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message and cause
     * 
     * @param message the error message
     * @param cause the cause of the exception
     */
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause, STATUS, ERROR_CODE);
    }
}