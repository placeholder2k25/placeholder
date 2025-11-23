package com.example.email_service.service;

import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.example.email_service.models.MailEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailConsumer {

    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    // Make sure this listener uses the factory defined above (default bean name is kafkaListenerContainerFactory)
    @KafkaListener(topics = "mail-topic", groupId = "mail-service")
    public void consume(String message) throws Exception {
        MailEvent event = objectMapper.readValue(message, MailEvent.class);
        log.info("Received event: {}", event);

        Map<String, Object> payload = event.getPayload();

        switch (event.getEventType()) {
            case "CREATOR_REGISTERED":
                handleCreatorRegistered(payload);
                break;
            case "BRAND_REGISTERED":
                handleBrandRegistered(payload);
                break;
            case "FUNDS_ADDED":
                handleFundsAdded(payload);
                break;
            default:
                log.warn("Unknown eventType {}", event.getEventType());
        }
    }

    private void handleCreatorRegistered(Map<String, Object> payload) {
        String to = (String) payload.get("to");
        String name = (String) payload.get("name");
        emailService.sendMail(to, "Welcome Creator!", "Hi " + name + ", welcome!");
    }

    private void handleBrandRegistered(Map<String, Object> payload) {
        String to = (String) payload.get("to");
        String brand = (String) payload.get("name");
        emailService.sendMail(to, "Welcome Brand!", "Hi " + brand + ", thanks for joining.");
    }

    private void handleFundsAdded(Map<String, Object> payload) {
        String to = (String) payload.get("to");
        Object amount = payload.get("amount");
        emailService.sendMail(to, "Funds Added", "Your account was credited with " + amount + ".");
    }
}