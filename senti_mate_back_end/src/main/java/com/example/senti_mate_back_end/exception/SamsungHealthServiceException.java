package com.example.senti_mate_back_end.exception;

/**
 * Exception thrown when there is an error with the Samsung Health service
 */
public class SamsungHealthServiceException extends RuntimeException {
    
    public SamsungHealthServiceException(String message) {
        super(message);
    }
    
    public SamsungHealthServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}