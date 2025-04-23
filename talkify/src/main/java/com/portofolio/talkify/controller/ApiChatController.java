package com.portofolio.talkify.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.Notification.MessageTYPE;
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
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.transaction.Transactional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/chat")
public class ApiChatController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserConvertaionRepository userConvertaionRepository;
    
    @Autowired
    private ChatService chatService;

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Autowired 
    private GroupRepository groupRepository;

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getChatUser(@PathVariable("id") Long userId){
        try {
            User userData = this.userRepository.findById(userId).orElse(null);
            if (userData == null) {
                return ResponseUtil.generateErrorResponse("User is not found", userData, HttpStatus.NOT_FOUND);
            }

            List<UserConvertation> userConvertations = this.userConvertaionRepository.listConvertations(userId);
            Map<String, Object> response =  new HashMap<>();

            ArrayList<Object> pinnedResponse = new ArrayList<>();
            ArrayList<Object> unPinnedResponse = new ArrayList<>();
            List<UserGroups> userGroups = this.userGroupsRepository.listUserGroups(userId);

            for (UserGroups userGroup : userGroups) {
                if (userGroup.getIsPINNED()) {
                    Map<String , Object> pinnedGroupChat = chatService.getGroupChat(userId, userGroup);
                    pinnedResponse.add(pinnedGroupChat);
                } else{
                    Map<String , Object> unPinnedGroupChat = chatService.getGroupChat(userId, userGroup);
                    unPinnedResponse.add(unPinnedGroupChat);
                }
            }
            
            for (UserConvertation userConvertation : userConvertations) {
                if (userConvertation.getIsPINNED()) {
                    Map<String, Object> userChatProfile = chatService.getUserChat(userId, userConvertation);
                    pinnedResponse.add(userChatProfile);
                } else{
                    Map<String, Object> unPinnedProfie = chatService.getUserChat(userId, userConvertation);
                    unPinnedResponse.add(unPinnedProfie);
                    
                }
            }

            chatService.sortingUserChat(pinnedResponse);
            chatService.sortingUserChat(unPinnedResponse);

            response.put("pinned", pinnedResponse);
            response.put("unPinned", unPinnedResponse);
            
            return ResponseUtil.generateSuccessResponse("Success to get friends data", response);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get friends data", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @GetMapping("getMessage/{id}")
    public ResponseEntity<ApiResponse<Object>> getUserConvertationMsg(@PathVariable("id") Long convertationId, @RequestParam("message") String messageTYPE){
        try {
            if (messageTYPE.equalsIgnoreCase("TEXT")) {   
                UserConvertation userConvertation = userConvertaionRepository.findById(convertationId).orElse(null);
                if (userConvertation == null) {
                    return ResponseUtil.generateErrorResponse("Convertation is not found", userConvertation, HttpStatus.NOT_FOUND);
                }
                ArrayList<Object> userMessages = chatService.getTXTMessages(convertationId);
                
                return ResponseUtil.generateSuccessResponse("Success to get messages", userMessages);    
            } 

            Group group = groupRepository.findById(convertationId).orElse(null);
            
            if (group == null) {
                return ResponseUtil.generateErrorResponse("Group is not found", group, HttpStatus.NOT_FOUND);
            }

            ArrayList<Object> groupMessages = chatService.getGRPMessages(convertationId);

            if (groupMessages.size() == 0) {
                return ResponseUtil.generateSuccessResponse("Group message is not exist", groupMessages);
            }

            return ResponseUtil.generateSuccessResponse("Success to get messages", groupMessages);  
            
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get Messages", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("sendMessage/{id}")
    public ResponseEntity<ApiResponse<Object>> saveMessage(
        @PathVariable("id") Long userId,
        @RequestBody NotificationUser notificationUser, 
        @RequestParam MessageTYPE messageTYPE
        ){
        try {

            if (messageTYPE == MessageTYPE.TEXT) {
                User user = userRepository.findById(userId).orElse(null);
                if (user == null ) {
                    return ResponseUtil.generateErrorResponse("Receiver is not found", user, HttpStatus.NOT_FOUND);
                }
            } 

            if (messageTYPE == MessageTYPE.GROUP) {
                Group group = groupRepository.findById(userId).orElse(null);
                if (group == null) {
                    return ResponseUtil.generateErrorResponse("Group is not found", group, HttpStatus.NOT_FOUND);
                }
            }
            
            if (messageTYPE == MessageTYPE.TEXT){
                chatService.saveMessageText(notificationUser);
            } else {
                chatService.saveMessageGroup(notificationUser);
            }
            
            return ResponseUtil.generateSuccessResponse("Success to send message", null);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Error!", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
