package com.example.senti_mate_back_end.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * DTO for error responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    private int status;
    private String error;
    private String message;
    private String errorCode;
    private String path;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    @Builder.Default
    private List<ValidationError> validationErrors = new ArrayList<>();
    
    /**
     * Add validation errors from a map
     * 
     * @param errors map of field names to error messages
     */
    public void addValidationErrors(Map<String, String> errors) {
        if (errors != null) {
            errors.forEach(this::addValidationError);
        }
    }
    
    /**
     * Add a validation error
     * 
     * @param field the field name
     * @param message the error message
     */
    public void addValidationError(String field, String message) {
        validationErrors.add(new ValidationError(field, message));
    }
    
    /**
     * Nested class for validation errors
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
    }
}