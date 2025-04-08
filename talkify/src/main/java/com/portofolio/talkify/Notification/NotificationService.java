package com.portofolio.talkify.Notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
     
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, NotificationUser notificationUser){
        log.info("Sending WS notification to {} with payload", userId, notificationUser);
        
        messagingTemplate.convertAndSendToUser(
            userId, 
            "/chat", 
            notificationUser
        );
    }
}
