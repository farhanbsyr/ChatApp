package com.portofolio.talkify.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.portofolio.talkify.Notification.MessageTYPE;
import com.portofolio.talkify.Notification.NotificationSeen;
import com.portofolio.talkify.Notification.NotificationTYPE;
import com.portofolio.talkify.Notification.NotificationUser;
import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.GroupMessage;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserConvertation;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.modal.UserMessage;
import com.portofolio.talkify.repository.GroupMessageRepository;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.UserConvertaionRepository;
import com.portofolio.talkify.repository.UserGroupsRepository;
import com.portofolio.talkify.repository.UserMessageRepository;
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
    private GroupMessageRepository groupMessageRepository;

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Autowired 
    private UserConvertaionRepository userConvertaionRepository;

    @Autowired 
    private UserMessageRepository userMessageRepository;

    @Transactional
    @MessageMapping("/sendMessage")
    public void testSocket(NotificationUser notificationUser){ 
        Map<String, Object> response = new HashMap<>();
        if (notificationUser.getMessageTYPE() == MessageTYPE.TEXT) {
            UserConvertation userConvertation = userConvertaionRepository.findById(notificationUser.getConvertationId()).orElse(null);

            User user = userRepository.findById(notificationUser.getReceiverId()).orElse(null);
            if (user == null ) {
                response.put("type", NotificationTYPE.FAILED);
                response.put("message", "Receiver is not found");
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() , response);
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
                response.put("type", NotificationTYPE.FAILED);
                response.put("message", "Group is not found");
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() ,  response);
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

     @MessageMapping("/enterMessage")
     public void enterMessage(List<NotificationSeen> notificationSeens, Long userId){
        Map<String, Object> response = new HashMap<>();

        for (NotificationSeen notificationSeen : notificationSeens) {
            if (notificationSeen.getMessageTYPE() == MessageTYPE.TEXT) {
                UserMessage userMessage = userMessageRepository.findById(notificationSeen.getMessageId()).orElse(null);
                if (userMessage == null) {
                    response.put("type", NotificationTYPE.FAILED);
                    response.put("error: ", "Message is not found");
                    simpMessagingTemplate.convertAndSend("/topic/" + userId , response);
                    return;
                }
        
                userMessage.setIsSeen(true);
                userMessageRepository.save(userMessage);
        
                response.put("messageId", userMessage.getId());
                response.put("isSeen", userMessage.getIsSeen());
                response.put("type", NotificationTYPE.SEENMESSAGE);
                response.put("isGroup", MessageTYPE.TEXT);
        
                simpMessagingTemplate.convertAndSend("/topic/" + userMessage.getSender() , response);
                simpMessagingTemplate.convertAndSend("/topic/" + userMessage.getReceiver() , response);
            }
    
            if (notificationSeen.getMessageTYPE() == MessageTYPE.GROUP) {
                GroupMessage groupMessage = groupMessageRepository.findById(notificationSeen.getMessageId()).orElse(null);
                UserGroups userGroups = userGroupsRepository.findByGroupIdAndUserId(notificationSeen.getConversationId(), userId);
    
                List<UserGroups> listUserGroups = userGroupsRepository.listGroupsByGroupId(userGroups.getGroupId());
                if (groupMessage == null) {
    
                    response.put("type", NotificationTYPE.FAILED);
                    response.put("message", "Message is not found");
    
                    simpMessagingTemplate.convertAndSend("/topic/" + userId, response);
                    return;
                }
    
                if (userGroups.getSeeMessage().after(groupMessage.getCreatedOn())) {
                    Map<String, Object> seen = new HashMap<>();
    
                    seen.put("id", userGroups.getUser().getId());
                    seen.put("name", userGroups.getUser().getName());
    
                    response.put("messageId", notificationSeen.getMessageId());
                    response.put("type", NotificationTYPE.SEENMESSAGE);
                    response.put("seen", seen);
                    response.put("isGroup", MessageTYPE.GROUP);
                    
                    for (UserGroups userGroups2 : listUserGroups) {       
                        simpMessagingTemplate.convertAndSend("/topic/" + userGroups2.getUserId(), response);
                    }
                }
            
            }
    
        }
    }
}
// buat test enterMessage di front end dengan cara masukkan handleSeenMessage di left content lalu ketika di klik akan me trigger handleSeenMessage dan mengirim semua message isSeen False jika TEXT yang ada dalam conversationChat
// dan jika group akan mengirim message2 yang pada seen tidak ada id user tersebut
