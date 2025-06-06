package com.example.senti_mate_back_end.exception;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Exception thrown when validation fails for a request
 */
public class ValidationException extends BaseException {
    
    private static final HttpStatus STATUS = HttpStatus.BAD_REQUEST;
    private static final String ERROR_CODE = "VALIDATION_ERROR";
    
    private final Map<String, String> errors;
    
    /**
     * Constructor with binding result
     * 
     * @param bindingResult the binding result with validation errors
     */
    public ValidationException(BindingResult bindingResult) {
        super("Validation failed", STATUS, ERROR_CODE);
        this.errors = bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing + "; " + replacement
                ));
    }
    
    /**
     * Constructor with field and error message
     * 
     * @param field the field that failed validation
     * @param errorMessage the error message
     */
    public ValidationException(String field, String errorMessage) {
        super("Validation failed for field: " + field, STATUS, ERROR_CODE);
        this.errors = new HashMap<>();
        this.errors.put(field, errorMessage);
    }
    
    /**
     * Constructor with errors map
     * 
     * @param errors the map of field names to error messages
     */
    public ValidationException(Map<String, String> errors) {
        super("Validation failed for multiple fields", STATUS, ERROR_CODE);
        this.errors = new HashMap<>(errors);
    }
    
    /**
     * Constructor with custom message and errors map
     * 
     * @param message the error message
     * @param errors the map of field names to error messages
     */
    public ValidationException(String message, Map<String, String> errors) {
        super(message, STATUS, ERROR_CODE);
        this.errors = new HashMap<>(errors);
    }
    
    /**
     * Get the validation errors
     * 
     * @return the map of field names to error messages
     */
    public Map<String, String> getErrors() {
        return errors;
    }
}