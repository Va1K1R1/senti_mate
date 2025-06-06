package com.example.senti_mate_back_end.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for ChatGPT API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatGPTRequest {
    
    private String model;
    private List<Message> messages;
    private Double temperature;
    
    @JsonProperty("max_tokens")
    private Integer maxTokens;
    
    private Double topP;
    private Integer n;
    private Boolean stream;
    private List<String> stop;
    
    @JsonProperty("presence_penalty")
    private Double presencePenalty;
    
    @JsonProperty("frequency_penalty")
    private Double frequencyPenalty;
    
    private String user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role; // "system", "user", "assistant"
        private String content;
        private String name;
    }
    
    // Convenience methods
    public static ChatGPTRequest createSimpleRequest(String model, String userMessage) {
        return ChatGPTRequest.builder()
                .model(model)
                .messages(List.of(Message.builder()
                        .role("user")
                        .content(userMessage)
                        .build()))
                .build();
    }
    
    public static ChatGPTRequest createWithSystemPrompt(String model, String systemPrompt, String userMessage) {
        return ChatGPTRequest.builder()
                .model(model)
                .messages(List.of(
                        Message.builder().role("system").content(systemPrompt).build(),
                        Message.builder().role("user").content(userMessage).build()
                ))
                .build();
    }
}