package com.portofolio.talkify.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.portofolio.talkify.Notification.MessageTYPE;
import com.portofolio.talkify.Notification.NotificationTYPE;
import com.portofolio.talkify.Notification.NotificationUser;
import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserConvertation;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.UserConvertaionRepository;
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

    @Autowired 
    private UserConvertaionRepository userConvertaionRepository;

    @Transactional
    @MessageMapping("/sendMessage")
    public void testSocket(NotificationUser notificationUser){ 
        Map<String, Object> response = new HashMap<>();
        if (notificationUser.getMessageTYPE() == MessageTYPE.TEXT) {
            UserConvertation userConvertation = userConvertaionRepository.findById(notificationUser.getConvertationId()).orElse(null);

            User user = userRepository.findById(notificationUser.getReceiverId()).orElse(null);
            if (user == null ) {
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() , "Receiver is not found");
            } else{
                response.put("message", chatService.saveMessageText(notificationUser));
                response.put("type", NotificationTYPE.MESSAGE);
                response.put("isPinned", userConvertation.getIsPINNED());
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getReceiverId() , response);
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() , response);
            }
        } else {
            Group group = groupRepository.findById(notificationUser.getConvertationId()).orElse(null);
            UserConvertation userConvertation = userConvertaionRepository.findById(notificationUser.getConvertationId()).orElse(null);
            if (group == null) {
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() ,  "Group is not found");
            } else {
                List<UserGroups> userGroups = userGroupsRepository.listUserGroupByIdGroup(notificationUser.getConvertationId());
                response.put("message", chatService.saveMessageGroup(notificationUser));
                response.put("type", NotificationTYPE.MESSAGE);
                response.put("isPinned", userConvertation.getIsPINNED());
                for (UserGroups userGroup : userGroups) {
                    simpMessagingTemplate.convertAndSend("/topic/" + userGroup.getUserId() , response);
                }
            } 
        }
        
     }
}
