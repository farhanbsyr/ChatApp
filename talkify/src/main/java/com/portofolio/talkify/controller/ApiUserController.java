package com.portofolio.talkify.controller;

import java.util.Base64;
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
import org.springframework.web.multipart.MultipartFile;

import com.portofolio.talkify.modal.Group;
import com.portofolio.talkify.modal.ProfileImage;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserGroups;
import com.portofolio.talkify.modal.UserMessage;
import com.portofolio.talkify.repository.GroupRepository;
import com.portofolio.talkify.repository.ProfileImageRepository;
import com.portofolio.talkify.repository.UserGroupsRepository;
import com.portofolio.talkify.repository.UserMessageRepository;
import com.portofolio.talkify.repository.UserRepository;
import com.portofolio.talkify.service.JWTService;
import com.portofolio.talkify.service.UserService;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
public class ApiUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileImageRepository profileImageRepository;

    @Autowired
    private UserGroupsRepository userGroupsRepository;

    @Autowired
    private UserMessageRepository userMessageRepository;

    @Autowired 
    private GroupRepository groupRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserService userService;


    // profile user
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getUserData(@PathVariable("id") Long userId){
        try {
            User userData = this.userRepository.findById(userId).orElse(null);
            ProfileImage profileImage = null;
            if (userData == null) {
                return ResponseUtil.generateErrorResponse("User is not found", userData, HttpStatus.NOT_FOUND);
            }

            if (userData.getIdProfileImage() != null) {
                profileImage = profileImageRepository.findImangeProfileUser(userId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", userData.getId());
            response.put("name", userData.getName());
            response.put("handphoneNumber", userData.getHandphoneNumber());
            response.put("email", userData.getEmail());
            response.put("profileImage", 
                    profileImage != null
                        ? Base64.getEncoder().encodeToString(profileImage.getImage())
                        : "");

            return ResponseUtil.generateSuccessResponse("Success to get data user: " + userData.getName(), response);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get data user", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @GetMapping("userId")
    public ResponseEntity<ApiResponse<Object>> getUserId(HttpServletRequest request){
        try {
            String token = null;
            Long userId = null;
            Object response = null;

            Cookie[] cookies = request.getCookies();

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("access_token")) {
                        token = cookie.getValue();
                    }
                }
            }

            if (token == null) {
                return ResponseUtil.generateErrorResponse("Token is not found", null, HttpStatus.NOT_FOUND);
            }

            userId = jwtService.extractUserId(token);

            if (userId == null) {
                return ResponseUtil.generateErrorResponse("UserId is not found", cookies, HttpStatus.NOT_FOUND);
            }

            response = userService.getProfile(userId);

            return ResponseUtil.generateSuccessResponse("Success to get userId", response);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get user id", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // user friend udah dapet kurang data profile nya
    // @Transactional
    // @GetMapping("friend/{id}")
    // public ResponseEntity<ApiResponse<Object>> getAllUserFriends(@PathVariable("id") Long userId){
    //         try {
    //             User user = this.userRepository.findById(userId).orElse(null);
    //             if (user == null) {
    //                 return ResponseUtil.generateErrorResponse("User is not found", user, HttpStatus.NOT_FOUND);
    //             }
    //             ArrayList<Object> profileFriends = new ArrayList<>();
    //             List<UserFriends> listUserFriends = this.userFriendsRepository.findByUserId(Long.parseLong(userId.toString()));
                
                

    //             if (listUserFriends == null) {
    //                 return ResponseUtil.generateErrorResponse("User isn't have friend" + user.getName(), listUserFriends, HttpStatus.NOT_FOUND);
    //             }

    //             for (UserFriends userFriends : listUserFriends) {
    //                 Map<String, Object> response = new HashMap<>();
    //                 Map<String,Object> profileImageResponse = new HashMap<>();
    //                 Map<String, Object> lastMessageResponse = new HashMap<>();
                    
    //                 User profileUser = this.userRepository.findById(userFriends.getUserFriendId()).orElse(null);
    //                 if (profileUser != null) {
    //                     UserMessage lastMessage = this.userMessageRepository.lastMessage(userId, profileUser.getId());
                        
    //                     if (profileUser.getProfileImage() != null) {
    //                         profileImageResponse.put("userId", profileUser.getProfileImage().getUserId());
    //                         profileImageResponse.put("image", profileUser.getProfileImage().getImage());                    
    //                     }

    //                     if (lastMessage != null) {
    //                         lastMessageResponse.put("sender", lastMessage.getSender());
    //                         lastMessageResponse.put("reciever", lastMessage.getReceiver());
    //                         lastMessageResponse.put("message", lastMessage.getMessage());   
    //                         lastMessageResponse.put("isSeen", lastMessage.getIsSeen()); 
    //                         response.put("lastMessage", lastMessageResponse);
    //                     } else{
    //                         response.put("lastMessage", lastMessage);
    //                     }

    //                     response.put("id", profileUser.getId());
    //                     response.put("name", profileUser.getName());
    //                     response.put("email", profileUser.getEmail());
    //                     response.put("handphoneNumber", profileUser.getHandphoneNumber());
    //                     response.put("profileImage", profileImageResponse);
    //                     response.put("isSaved", userFriends.getIsSaved());
    //                     profileFriends.add(response);
    //                 }
    //             }

    //             return ResponseUtil.generateSuccessResponse("Success to get friend", profileFriends);
    //         } catch (Exception e) {
    //             // TODO: handle exception
    //             return ResponseUtil.generateErrorResponse("Failed to get data friend", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    //         }
    // }

    @GetMapping("/group/{id}")
    public ResponseEntity<ApiResponse<Object>> getAllUserGroups(@PathVariable("id") Long userId){
        try {

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseUtil.generateErrorResponse("User not found", user, HttpStatus.NOT_FOUND);
            }
       
            List<UserGroups> listGroup = userGroupsRepository.listUserGroups(Long.parseLong(String.valueOf(userId)));
   
            return ResponseUtil.generateSuccessResponse("Success to get user group", listGroup);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to get user group", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<Object>> testInputMessage(
        @RequestBody Map<String,Object> messageData ) {
        try {
            Long userSatu = Long.parseLong(String.valueOf(messageData.get("userSatu")));
            Long userDua = Long.parseLong(String.valueOf(messageData.get("userDua")));
            String message = String.valueOf(messageData.get("message"));
            
            UserMessage userMessage = new UserMessage();
            userMessage.setSender(userSatu);
            userMessage.setReceiver(userDua);
            userMessage.setMessage(message);

            userMessageRepository.save(userMessage);
            return  ResponseUtil.generateSuccessResponse("Success to sent message", userMessage);
        } catch (Exception e) {
            // TODO: handle exception
            return ResponseUtil.generateErrorResponse("Failed to sent message", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/lainnya")
    public ResponseEntity<ApiResponse<Object>> saveProfile
    (
        @RequestParam("image") MultipartFile image, 
        @RequestParam("userId") Long userId, 
        @RequestParam("isGroup") Boolean isGroup
    ){
        try {
            // String image = request.get("image").toString();
            // Long userId = Long.parseLong(request.get("userId").toString());
            ProfileImage profileImageUser = new ProfileImage();
            if (isGroup == false) {
                User user = this.userRepository.findById(userId).orElse(null);
                
                if (user == null) {
                    return ResponseUtil.generateErrorResponse("User is not found", user, HttpStatus.NOT_FOUND);
                }
    
                profileImageUser.setUserId(userId);
                // profileImageUser.setImage(Base64.getDecoder().decode(image));
                profileImageUser.setImage(image.getBytes());
                profileImageUser.setIsGroup(isGroup);
                ProfileImage profileImage = profileImageRepository.save(profileImageUser);
                
                user.setIdProfileImage(profileImage.getId());
                User updatedUser = userRepository.save(user);
                return ResponseUtil.generateSuccessResponse("Success to update user profile", updatedUser);
            }

            Group group = this.groupRepository.findById(userId).orElse(null);

            if (group == null) {
                return ResponseUtil.generateErrorResponse("Group is not found", group, HttpStatus.NOT_FOUND);
            }
            profileImageUser.setUserId(userId);
            profileImageUser.setImage(image.getBytes());
            profileImageUser.setIsGroup(isGroup);
            ProfileImage profileImage = profileImageRepository.save(profileImageUser);

            group.setIdProfileImage(profileImage.getId());
            groupRepository.save(group);
            return ResponseUtil.generateSuccessResponse("Success to update group profile", HttpStatus.CREATED);
        } catch (Exception e) {
            // TODO: handle exception
            return ResponseUtil.generateErrorResponse("Failed to update user profile", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}
