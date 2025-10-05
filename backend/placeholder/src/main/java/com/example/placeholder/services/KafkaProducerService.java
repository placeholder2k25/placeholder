package com.example.placeholder.services;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.placeholder.models.MailEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, MailEvent> kafkaTemplate;

    private static final String MAIL_TOPIC = "mail-topic";

    public void sendEmailEvent(MailEvent event) {
        try {
            kafkaTemplate.send(MAIL_TOPIC, event);
            log.info("📨 Sent event to Kafka topic '{}': {}", MAIL_TOPIC, event);
        } catch (Exception e) {
            log.error("❌ Failed to send event to Kafka", e);
        }
    }
}
