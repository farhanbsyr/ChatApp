package com.portofolio.talkify.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.portofolio.talkify.Notification.MessageTYPE;
import com.portofolio.talkify.Notification.NotificationUser;
import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.UserGroupsRepository;
import com.portofolio.talkify.repository.UserRepository;
import com.portofolio.talkify.service.ChatService;

import jakarta.transaction.Transactional;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private GroupRepository groupRepository;

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Transactional
    @MessageMapping("/sendMessage")
    public void testSocket(NotificationUser notificationUser){ 

        if (notificationUser.getMessageTYPE() == MessageTYPE.TEXT) {
            User user = userRepository.findById(notificationUser.getReceiverId()).orElse(null);
            if (user == null ) {
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() , "Receiver is not found");
            } else{
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getReceiverId() , chatService.saveMessageText(notificationUser));
            }
        } else {
            Group group = groupRepository.findById(notificationUser.getConvertationId()).orElse(null);
            if (group == null) {
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() ,  "Group is not found");
            } else {
                List<UserGroups> userGroups = userGroupsRepository.listUserGroupByIdGroup(notificationUser.getConvertationId());
                Object message = chatService.saveMessageGroup(notificationUser);
                for (UserGroups userGroup : userGroups) {
                    simpMessagingTemplate.convertAndSend("/topic/" + userGroup.getUserId() , message);
                }
            } 
        }
        
     }
}
