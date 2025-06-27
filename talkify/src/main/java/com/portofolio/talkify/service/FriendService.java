package com.portofolio.talkify.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.portofolio.talkify.modal.ProfileImage;
import com.portofolio.talkify.modal.User;
import com.portofolio.talkify.modal.UserFriends;
import com.portofolio.talkify.repository.ProfileImageRepository;
import com.portofolio.talkify.repository.UserFriendsRepository;
import com.portofolio.talkify.repository.UserRepository;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class FriendService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserFriendsRepository userFriendsRepository;

    @Autowired 
    ProfileImageRepository profileImageRepository;

    @Autowired
    JWTService jwtService;

    public ResponseEntity<ApiResponse<Object>> searchFriend(String identity, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        String token = null;
        Long userId = null;
        Cookie[] cookies = request.getCookies();
        UserFriends isFriend = null;
        String base64Image = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("access_token")) {
                    token = cookie.getValue();
                }
            }
        }

        if (token != null) {
            userId = jwtService.extractUserId(token);
        }

        System.out.println("identity: " + identity);
        User userFriend = userRepository.findFullUserByEmailOrNumber(identity); 
        
        if (userFriend == null) {
            return ResponseUtil.generateSuccessResponse("User is not found", userFriend, HttpStatus.NOT_FOUND);
        }

        if (userFriend.getIdProfileImage() != null) {
            ProfileImage profileImage = profileImageRepository.findImangeProfileUser(userFriend.getId());
            base64Image = Base64.getEncoder().encodeToString(profileImage.getImage());
        }

        result.put("name", userFriend.getName());
        result.put("identity", identity);
        result.put("profile", base64Image);
        
        if (userId !=  null && userId == userFriend.getId()) {
            return ResponseUtil.generateSuccessResponse("You can't add yourself", null, HttpStatus.BAD_REQUEST);
        }

        if (userId != null) {
            isFriend = userFriendsRepository.findUserFriendByIdFriends(userId, userFriend.getId());
        }

        if (isFriend != null) {
            result.put("isFriend", true);
        } else{
            result.put("isFriend", false);
        }

        return ResponseUtil.generateSuccessResponse("Success to get a user", result);
    }

}
