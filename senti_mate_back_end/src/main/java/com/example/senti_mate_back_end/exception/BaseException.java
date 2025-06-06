package com.example.senti_mate_back_end.exception;

import org.springframework.http.HttpStatus;

/**
 * Base exception class for all custom exceptions in the application
 */
public abstract class BaseException extends RuntimeException {
    
    private final HttpStatus status;
    private final String errorCode;
    
    /**
     * Constructor with message, status, and error code
     * 
     * @param message the error message
     * @param status the HTTP status code
     * @param errorCode the error code
     */
    public BaseException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    /**
     * Constructor with message and status
     * 
     * @param message the error message
     * @param status the HTTP status code
     */
    public BaseException(String message, HttpStatus status) {
        this(message, status, null);
    }
    
    /**
     * Constructor with message, cause, status, and error code
     * 
     * @param message the error message
     * @param cause the cause of the exception
     * @param status the HTTP status code
     * @param errorCode the error code
     */
    public BaseException(String message, Throwable cause, HttpStatus status, String errorCode) {
        super(message, cause);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    /**
     * Constructor with message, cause, and status
     * 
     * @param message the error message
     * @param cause the cause of the exception
     * @param status the HTTP status code
     */
    public BaseException(String message, Throwable cause, HttpStatus status) {
        this(message, cause, status, null);
    }
    
    /**
     * Get the HTTP status code
     * 
     * @return the HTTP status code
     */
    public HttpStatus getStatus() {
        return status;
    }
    
    /**
     * Get the error code
     * 
     * @return the error code
     */
    public String getErrorCode() {
        return errorCode;
    }
}