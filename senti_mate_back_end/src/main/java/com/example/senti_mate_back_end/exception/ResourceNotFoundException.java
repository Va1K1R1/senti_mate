package com.example.senti_mate_back_end.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends BaseException {
    
    private static final HttpStatus STATUS = HttpStatus.NOT_FOUND;
    private static final String ERROR_CODE = "RESOURCE_NOT_FOUND";
    
    /**
     * Constructor with resource name and id
     * 
     * @param resourceName the name of the resource
     * @param id the id of the resource
     */
    public ResourceNotFoundException(String resourceName, Object id) {
        super(String.format("%s not found with id: %s", resourceName, id), STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with resource name and field
     * 
     * @param resourceName the name of the resource
     * @param fieldName the name of the field
     * @param fieldValue the value of the field
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue), STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message
     * 
     * @param message the error message
     */
    public ResourceNotFoundException(String message) {
        super(message, STATUS, ERROR_CODE);
    }
    
    /**
     * Constructor with custom message and cause
     * 
     * @param message the error message
     * @param cause the cause of the exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause, STATUS, ERROR_CODE);
    }
}