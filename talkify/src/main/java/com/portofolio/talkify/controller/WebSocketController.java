package com.portofolio.talkify.controller;

import java.util.Date;
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
import com.portofolio.talkify.modal.ChatConvertation;
import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserConvertation;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.modal.UserMessage;
import com.portofolio.talkify.repository.ChatConvertationRepository;
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
    private UserGroupsRepository userGroupsRepository;

    @Autowired 
    private UserConvertaionRepository userConvertaionRepository;

    @Autowired 
    private UserMessageRepository userMessageRepository;

    @Autowired
    private ChatConvertationRepository chatConvertationRepository;

    @Transactional
    @MessageMapping("/sentImage")
    public void sentImage(NotificationUser notificationUser){
        
    }

    @Transactional
    @MessageMapping("/sendMessage")
    public void testSocket(NotificationUser notificationUser){ 
        Map<String, Object> response = new HashMap<>();
        
        if (notificationUser.getMessageTYPE() == MessageTYPE.TEXT) {
            UserConvertation userConvertation = userConvertaionRepository.findById(notificationUser.getConvertationId()).orElse(null);
            List<ChatConvertation> chatConvertations = chatConvertationRepository.findByUserConvertationId(userConvertation.getId());
            
            User user = userRepository.findById(notificationUser.getReceiverId()).orElse(null);
            if (user == null ) {
                response.put("type", NotificationTYPE.FAILED);
                response.put("message", "Receiver is not found");
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() , response);
            } else{
                response.put("message", chatService.saveMessageText(notificationUser));
                response.put("type", NotificationTYPE.MESSAGE);
                for (ChatConvertation chatConvertation : chatConvertations) {
                    response.put("isPinned", chatConvertation.getIsPINNED());
                    simpMessagingTemplate.convertAndSend("/topic/" + chatConvertation.getUserId() , response);
                }
            }
        } else {
            Group group = groupRepository.findById(notificationUser.getConvertationId()).orElse(null);
            // UserConvertation userConvertation = userConvertaionRepository.findById(notificationUser.getConvertationId()).orElse(null);
            if (group == null) {
                response.put("type", NotificationTYPE.FAILED);
                response.put("message", "Group is not found");
                simpMessagingTemplate.convertAndSend("/topic/" + notificationUser.getSenderId() ,  response);
            } else {
                List<UserGroups> userGroups = userGroupsRepository.listUserGroupByIdGroup(notificationUser.getConvertationId());
                response.put("message", chatService.saveMessageGroup(notificationUser));
                response.put("type", NotificationTYPE.MESSAGE);
                for (UserGroups userGroup : userGroups) {
                    response.put("isPinned", userGroup.getIsPINNED());
                    simpMessagingTemplate.convertAndSend("/topic/" + userGroup.getUserId() , response);
                }
            } 
        }
     }

    @Transactional
    @MessageMapping("/enterMessage")
    public void enterMessage(NotificationSeen notificationSeen){
        Map<String, Object> response = new HashMap<>();
        // ArrayList<Object> listResponse = new ArrayList<>();

        if (notificationSeen.getMessageTYPE() == MessageTYPE.TEXT) {
            List<UserMessage> listMessageFalse = userMessageRepository.listFalseMessage(notificationSeen.getConversationId(), notificationSeen.getUserId());
            UserConvertation userConvertation = userConvertaionRepository.findById(notificationSeen.getConversationId()).orElse(null);
            
            if (userConvertation == null) {
                response.put("type", NotificationTYPE.FAILED);
                response.put("error: ", "Message is not found");
                simpMessagingTemplate.convertAndSend("/topic/" + notificationSeen.getUserId() , response);
                return;
            }

            List<ChatConvertation> chatConvertations = chatConvertationRepository.findByUserConvertationId(userConvertation.getId());

            for (UserMessage userMessage : listMessageFalse) {
                // Map<String, Object> responObj = new HashMap<>();
                userMessage.setIsSeen(true);
                userMessageRepository.save(userMessage);

                // responObj.put("messageId", userMessage.getId());
                // responObj.put("isSeen", userMessage.getIsSeen());
                
                // listResponse.add(responObj);
            }

            response.put("conversationId", userConvertation.getId());
            response.put("type", NotificationTYPE.SEENMESSAGE);
            response.put("isGroup", MessageTYPE.TEXT);
            
            for (ChatConvertation chatConvertation : chatConvertations) {
                response.put("isPinned", chatConvertation.getIsPINNED());
                simpMessagingTemplate.convertAndSend("/topic/" + chatConvertation.getUserId() , response);
                return;
            }
        }
        if (notificationSeen.getMessageTYPE() == MessageTYPE.GROUP) {
            UserGroups userGroups = userGroupsRepository.findByGroupIdAndUserId(notificationSeen.getConversationId(), notificationSeen.getUserId());
            // List<GroupMessage> listGroupMessages = groupMessageRepository.listFalseGroupMessages(notificationSeen.getConversationId(), notificationSeen.getUserId(), userGroups.getSeeMessage());
            List<UserGroups> listUserGroups = userGroupsRepository.listGroupsByGroupId(userGroups.getGroupId());
            Group group = groupRepository.findById(notificationSeen.getConversationId()).orElse(null);

            if (group == null) {
                response.put("type", NotificationTYPE.FAILED);
                response.put("error", "Group is not found");

                simpMessagingTemplate.convertAndSend("/topic/" + notificationSeen.getUserId(), response);
                return;
            }

            Map<String,Object> seenBy = new HashMap<>();
            seenBy.put("userId", userGroups.getUser().getId());
            seenBy.put("name", userGroups.getUser().getName());

            // for (GroupMessage groupMessage : listGroupMessages) {
            //     listResponse.add(groupMessage.getId());
            // }

            response.put("seeMessage", userGroups.getSeeMessage());

            userGroups.setSeeMessage(new Date());
            userGroupsRepository.save(userGroups);

            response.put("groupId", userGroups.getGroupId());
            response.put("isPinned", userGroups.getIsPINNED());
            response.put("seenBy", seenBy);
            // response.put("seen", listResponse);
            response.put("type", NotificationTYPE.SEENMESSAGE);
            response.put("isGroup", MessageTYPE.GROUP);
           
            for (UserGroups userGroup : listUserGroups) {    
                simpMessagingTemplate.convertAndSend("/topic/" + userGroup.getUserId(), response);
            }
        }
    }


}

// seen pada userMessage adalah object yang berisikan messageId dan true/false isSeen
// kalo seen pada group adalah berisika list Id dari groupMessage