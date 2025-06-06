package com.example.senti_mate_back_end.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a resource already exists
 */
public class DuplicateResourceException extends BaseException {
    
    private static final HttpStatus STATUS = HttpStatus.CONFLICT;
    private static final String ERROR_CODE = "DUPLICATE_RESOURCE";
    
    /**
     * Constructor with resource name and field
     * 
     * @param resourceName the name of the resource
     * @param fieldName the name of the field
     * @param fieldValue the value of the field
     */
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s already exists with %s: %s", resourceName, fieldName, fieldValue), STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message
     * 
     * @param message the error message
     */
    public DuplicateResourceException(String message) {
        super(message, STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message and cause
     * 
     * @param message the error message
     * @param cause the cause of the exception
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause, STATUS, ERROR_CODE);
    }
}