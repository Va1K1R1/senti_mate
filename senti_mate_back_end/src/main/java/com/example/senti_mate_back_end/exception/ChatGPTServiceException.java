package com.example.senti_mate_back_end.exception;

/**
 * Exception thrown when there is an error in the ChatGPT service
 */
public class ChatGPTServiceException extends RuntimeException {
    
    public ChatGPTServiceException(String message) {
        super(message);
    }
    
    public ChatGPTServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}