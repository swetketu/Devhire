package com.devhire.notification.kafka;

import com.devhire.notification.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    private final NotificationService notificationService;

    public KafkaConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = "application-status",
            groupId = "devhire-group"
    )
    public void consume(String message) {

        System.out.println("Kafka message received: " + message);

        String[] parts = message.split("\\|", 2);

        if (parts.length != 2) {
            System.out.println("Invalid Kafka message: " + message);
            return;
        }

        try {
            Long candidateId = Long.parseLong(parts[0]);

            String notificationMessage = parts[1];

            notificationService.createNotification(
                    candidateId,
                    notificationMessage
            );

            System.out.println("Notification saved successfully.");

        } catch (Exception e) {
            System.out.println(
                    "Error processing Kafka message: "
                            + e.getMessage()
            );
        }
    }
}