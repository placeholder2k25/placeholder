package com.example.placeholder.models;

import java.time.Instant;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailEvent {
    private String eventId;
    private String eventType;       // e.g., "USER_REGISTERED"
    private Instant timestamp;
    private Map<String, Object> payload;
    private int retryCount;
}
