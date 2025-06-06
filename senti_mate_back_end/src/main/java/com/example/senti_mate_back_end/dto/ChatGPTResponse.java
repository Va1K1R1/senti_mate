package com.example.senti_mate_back_end.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Response DTO for ChatGPT API
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatGPTResponse {
    
    private String id;
    private String object;
    private Long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;
    private Error error;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private Integer index;
        private Message message;
        
        @JsonProperty("finish_reason")
        private String finishReason;
        
        private Double logprobs;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String role;
        private String content;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Usage {
        @JsonProperty("prompt_tokens")
        private Integer promptTokens;
        
        @JsonProperty("completion_tokens")
        private Integer completionTokens;
        
        @JsonProperty("total_tokens")
        private Integer totalTokens;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Error {
        private String message;
        private String type;
        private String param;
        private String code;
    }
    
    // Convenience methods
    public String getFirstChoiceContent() {
        return choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null
                ? choices.get(0).getMessage().getContent()
                : null;
    }
    
    public boolean hasError() {
        return error != null;
    }
}