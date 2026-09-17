package com.devhire.notification.service;

import com.devhire.notification.entity.Notification;
import com.devhire.notification.repository.NotificationRepository;
import com.devhire.user.entity.User;
import com.devhire.user.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // CREATE NOTIFICATION
    // =========================

    @CacheEvict(
            value = {
                    "notifications",
                    "unreadNotifications"
            },
            allEntries = true
    )
    public Notification createNotification(
            Long userId,
            String message) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Notification notification =
                new Notification(user, message);

        return notificationRepository.save(notification);
    }


    // =========================
    // GET NOTIFICATIONS
    // =========================

    @Cacheable(
            value = "notifications",
            key = "#userId"
    )
    public List<Notification> getNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }


    // =========================
    // UNREAD COUNT
    // =========================

    @Cacheable(
            value = "unreadNotifications",
            key = "#userId"
    )
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }


    // =========================
    // MARK AS READ
    // =========================

    @CacheEvict(
            value = {
                    "notifications",
                    "unreadNotifications"
            },
            allEntries = true
    )
    public void markAsRead(
            Long notificationId,
            String email) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "You are not authorized to update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}