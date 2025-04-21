package com.portofolio.talkify.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.Notification.MessageTYPE;
import com.portofolio.talkify.Notification.NotificationUser;
import com.portofolio.talkify.modal.DeletedMessage;
import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.GroupMessage;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserConvertation;
import com.portofolio.talkify.modal.UserFriends;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.modal.UserMessage;
import com.portofolio.talkify.repository.DeleteMessageRepository;
import com.portofolio.talkify.repository.GroupMessageRepository;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.UserFriendsRepository;
import com.portofolio.talkify.repository.UserGroupsRepository;
import com.portofolio.talkify.repository.UserMessageRepository;
import com.portofolio.talkify.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ChatService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFriendsRepository userFriendsRepository;

    @Autowired
    private UserMessageRepository userMessageRepository;

    @Autowired
    private GroupMessageRepository groupMessageRepository;

    @Autowired 
    private GroupRepository groupRepository;

    @Autowired
    private DeleteMessageRepository deleteMessageRepository;

    @Autowired
    private UserGroupsRepository userGroupsRepository;
   
    public Map<String, Object> getUserChat (Long userId, UserConvertation userConvertation){
        Map<String, Object> userChatProfile = new HashMap<>();
        Map<String, Object> profileImageResponse = new HashMap<>();
        Map<String, Object> lastMessageResponse = new HashMap<>();

        Long userChat = userConvertation.getUserSatuId() != userId
                        ? userConvertation.getUserSatuId() 
                        : userConvertation.getUserDuaId();

        User profileUser = this.userRepository.findById(userChat).orElse(null);    
        UserFriends userFriends = this.userFriendsRepository.findUserFriendByIdFriends(userId, userChat);

        if (profileUser == null) {
            return null; // Jika profileUser tidak ditemukan, kembalikan null
        }

        UserMessage lastMessage = this.userMessageRepository.lastMessage(userConvertation.getId());

        if (profileUser.getProfileImage() != null) {
            profileImageResponse.put("userId", profileUser.getProfileImage().getUserId());
            profileImageResponse.put("image", profileUser.getProfileImage().getImage());
            userChatProfile.put("profileImage", profileImageResponse);
        } else {
            userChatProfile.put("profileImage", profileUser.getProfileImage());
        }

        if (lastMessage != null) {
            lastMessageResponse.put("sender", lastMessage.getSender());
            lastMessageResponse.put("reciever", lastMessage.getReceiver());
            lastMessageResponse.put("message", lastMessage.getMessage());
            lastMessageResponse.put("isSeen", lastMessage.getIsSeen());
            lastMessageResponse.put("createdAt", lastMessage.getCreatedOn());
            lastMessageResponse.put("createBy", lastMessage.getCreatedBy());
            userChatProfile.put("lastMessage", lastMessageResponse);
            userChatProfile.put("createdTime", lastMessage.getCreatedOn());
        } else if (userConvertation.getIsDelete() != true && lastMessage == null) {
            userChatProfile.put("lastMessage", lastMessage);
            userChatProfile.put("createdTime", userConvertation.getCreatedOn());
        }

        // Menentukan apakah pengguna adalah teman
        if (userFriends == null) {
            userChatProfile.put("userFriends", false);
        } else {
            userChatProfile.put("userFriends", true);
        }

        // Mengatur informasi lainnya
        userChatProfile.put("id", profileUser.getId());
        userChatProfile.put("userConvertationId", userConvertation.getId());
        userChatProfile.put("name", profileUser.getName());
        userChatProfile.put("email", profileUser.getEmail());
        userChatProfile.put("handphoneNumber", profileUser.getHandphoneNumber());
        userChatProfile.put("pinned", userConvertation.getIsPINNED());
        userChatProfile.put("isGroup", false);
        return userChatProfile;
    }

    public void sortingUserChat(List<Object> response){
        if (response == null || response.isEmpty()) {
            return;
        }

        int n = response.size();
        boolean swapped;
        
        // Iterasi untuk setiap elemen  
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            
            for (int j = 0; j < n - 1 - i; j++) {

                Map<String, Object> map1 = (Map<String, Object>) response.get(j);
                Map<String, Object> map2 = (Map<String, Object>) response.get(j + 1);

                Date createTime1 = (Date) map1.get("createdTime");
                Date createTime2 = (Date) map2.get("createdTime");
                
                if (createTime1 != null && createTime2 != null && createTime1.compareTo(createTime2) < 0) {
                   
                    Map<String, Object> temp = map1;
                    response.set(j, map2);
                    response.set(j + 1, temp);
                    swapped = true;
                }
            }
            
            if (!swapped) {
                break;
            }
        }
    }

    @Transactional
    public Map<String, Object> getGroupChat(Long userId, UserGroups userGroup){
        Map<String, Object> detailGroupUser = new HashMap<>();
        Map<String, Object> profileImageResponse = new HashMap<>();
        Map<String, Object> lastMessageResponse = new HashMap<>();
        // yang ditambahkan profile dari groupnya
        // nanti di frontend tinggal buat ? utk 

        GroupMessage lastMessage = this.groupMessageRepository.lastGroupMessage(userGroup.getGroupId());
        Group group = this.groupRepository.findById(userGroup.getGroupId()).orElse(null);
        Integer memberGroup = this.groupRepository.countMemberGroup(userGroup.getGroupId());
        
        detailGroupUser.put("name", group.getGroupName());
        detailGroupUser.put("decription", group.getGroupDescription());
        detailGroupUser.put("lastSeen", userGroup.getSeeMessage());
        detailGroupUser.put("userGroupId", userGroup.getId());
        detailGroupUser.put("id", group.getId());
        detailGroupUser.put("memberGroup", memberGroup);
        if (group.getProfileImage() != null && group != null) {
            profileImageResponse.put("image", group.getProfileImage().getImage());
            profileImageResponse.put("idImage", group.getProfileImage().getId());
            detailGroupUser.put("profileImage", profileImageResponse);
        } else{
            detailGroupUser.put("profileImage", group.getProfileImage());
        }
        
        detailGroupUser.put("pinned", userGroup.getIsPINNED());
        if (lastMessage != null) {
            lastMessageResponse.put("createdAt", lastMessage.getCreatedOn());
            lastMessageResponse.put("createdBy", lastMessage.getCreatedBy());
            lastMessageResponse.put("sender", lastMessage.getSenderMessage());
            lastMessageResponse.put("message", lastMessage.getMessage());
            detailGroupUser.put("lastMessage", lastMessageResponse);
            detailGroupUser.put("createdTime", lastMessage.getCreatedOn());
        } else {
            detailGroupUser.put("lastMessage", lastMessage);
            detailGroupUser.put("createdTime", userGroup.getCreatedOn());
        }

        detailGroupUser.put("isGroup", true);

        return detailGroupUser;
    } 

    public Object saveMessageText(NotificationUser notificationUser){
        UserMessage userMessage = new UserMessage();

        userMessage.setIdUserConvertation(notificationUser.getConvertationId());
        userMessage.setSender(notificationUser.getSenderId());
        userMessage.setReceiver(notificationUser.getReceiverId());
        userMessage.setMessage(notificationUser.getMessage());
        userMessage.setIsSeen(notificationUser.getIsSeen());
        userMessage.setIsUnsend(notificationUser.getIsUnsend());    
        userMessage.setCreatedBy(notificationUser.getSenderId());
        userMessage.setCreatedOn(new Date());
        userMessage.setIsDelete(false);

        UserMessage savedUserMessage = userMessageRepository.save(userMessage);

        Object response = getMessage(savedUserMessage, MessageTYPE.TEXT);

        return response;
    }

    public Object saveMessageGroup(NotificationUser notificationUser){
        GroupMessage groupMessage = new GroupMessage();
        
        groupMessage.setGroupId(notificationUser.getConvertationId());
        groupMessage.setSenderMessage(notificationUser.getSenderId());
        groupMessage.setMessage(notificationUser.getMessage());
        groupMessage.setIsUnsend(notificationUser.getIsUnsend());
        groupMessage.setCreatedOn(new Date());
        groupMessage.setCreatedBy(notificationUser.getSenderId());

        User user = userRepository.findById(groupMessage.getSenderMessage()).orElse(null);

        if (user == null) {
            return "Failed";
        }

        GroupMessage savedGroupMessage = groupMessageRepository.save(groupMessage);
        Object response = getMessage(savedGroupMessage, user, MessageTYPE.GROUP);

        return response;
    }

    public ArrayList<Object> getTXTMessages(Long convertationId ){
        List<UserMessage> listUserMessages = userMessageRepository.listMessages(convertationId);
        ArrayList<Object> arrayResponse = new ArrayList<>();

        for (UserMessage userMessage : listUserMessages) {
            Object response = getMessage(userMessage, MessageTYPE.TEXT);
            arrayResponse.add(response);
        }

        return arrayResponse;
    }

    public ArrayList<Object> getGRPMessages(Long convertationId ){
        ArrayList<Object> response = new ArrayList<>();
        List<GroupMessage> listGroupMessages = groupMessageRepository.listGroupMessages(convertationId);

        for (GroupMessage groupMessage : listGroupMessages) {
            User user = userRepository.findById(groupMessage.getSenderMessage()).orElse(null);
            if (user == null) {
                continue;
            }

            // message.put("id", groupMessage.getId());
            // message.put("senderId", groupMessage.getSenderMessage());
            // message.put("message", groupMessage.getMessage());
            // message.put("isUnsent", groupMessage.getIsUnsend());
            // message.put("createdOn", groupMessage.getCreatedOn());
            // message.put("name", user.getName());
            // message.put("handphone", user.getHandphoneNumber());
            
            // if (user.getIdProfileImage() != null) {
            //     message.put("profileImage", user.getProfileImage());
            // } 

            // if (user.getIdProfileImage() == null) {
            //     message.put("profleImage", user.getIdProfileImage());
            // }
            // message.put("isGroup", true);
            response.add(getMessage(groupMessage, user, MessageTYPE.GROUP));
        }

        return response;
    }

    public Object getMessage(UserMessage userMessage, MessageTYPE messageTYPE){
        Map<String, Object> response = new HashMap<>();

        response.put("id", userMessage.getId());
        response.put("senderId", userMessage.getSender());
        response.put("receiverId", userMessage.getReceiver());
        response.put("message", userMessage.getMessage());
        response.put("createdOn", userMessage.getCreatedOn());
        response.put("isSeen", userMessage.getIsSeen());
        response.put("isUnsent", userMessage.getIsUnsend());
        response.put("isDelete", userMessage.getIsDelete());
        response.put("isGroup", false);

        return response;
    }

    public Object getMessage(GroupMessage groupMessage, User user, MessageTYPE messageTYPE){
        Map<String, Object> message = new HashMap<>();

        message.put("id", groupMessage.getId());
        message.put("senderId", groupMessage.getSenderMessage());
        message.put("message", groupMessage.getMessage());
        message.put("isUnsent", groupMessage.getIsUnsend());
        message.put("createdOn", groupMessage.getCreatedOn());
        message.put("name", user.getName());
        message.put("receiverId", groupMessage.getGroupId());
        message.put("isDelete", deleteMessage(groupMessage.getGroupId(), groupMessage.getSenderMessage(), groupMessage.getId()));
        message.put("seen", isSeenMessageGroup(groupMessage.getGroupId(), groupMessage.getCreatedOn()));
         
        if (user.getIdProfileImage() != null) {
            message.put("profileImage", user.getProfileImage());
        } 

        if (user.getIdProfileImage() == null) {
            message.put("profileImage", user.getIdProfileImage());
        }

        message.put("isGroup", true);

        return message;
    }

    public Boolean deleteMessage(Long convertationId, Long senderId, Long messageId){
        DeletedMessage isMessageDeleted = deleteMessageRepository.deletedMsg(convertationId, senderId, messageId);
        
        if (isMessageDeleted != null) {
            return true;
        }
        return false;
    }

    public Object isSeenMessageGroup(Long groupId, Date createOnMsg){
        Map<String, Object> response = new HashMap<>();

        List<UserGroups> listUser = userGroupsRepository.listUserGroupByIdGroup(groupId);
        for (UserGroups user : listUser) {
            if (user.getSeeMessage().after(createOnMsg)) {
                response.put("name", user.getUser().getName());
            }
        }
        return response;
    }
}
