package com.portofolio.talkify.Notification;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
     
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendNotification( NotificationUser notificationUser){
        log.info("Sending WS notification to {} with payload", notificationUser.getReceiverId(), notificationUser);
        
        messagingTemplate.convertAndSendToUser(
            String.valueOf(notificationUser.getReceiverId()), 
            "/chat", 
            notificationUser
        );
    }
}
