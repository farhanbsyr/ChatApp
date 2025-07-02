package com.portofolio.talkify.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
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

    @Autowired
    TokenService tokenService;

    @Autowired
    private UserService userService;

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

    public ResponseEntity<ApiResponse<Object>> addFriend(String identityUser, HttpServletRequest request) {
        String token = null;
        Long userId = null;
        token = tokenService.getTokenFromCookie(request.getCookies(), "access_token");

        if (token.equals("token has no value")) {
            return ResponseUtil.generateSuccessResponse("Token is no value", token, HttpStatus.BAD_REQUEST);
        }

        User friend = userRepository.findFullUserByEmailOrNumber(identityUser);

        if (friend == null) {
            return ResponseUtil.generateSuccessResponse("User is not found", null, HttpStatus.NOT_FOUND);
        }

        userId = jwtService.extractUserId(token);

        UserFriends userFriends = new UserFriends();
        userFriends.setUserId(userId);
        userFriends.setUserFriendId(friend.getId());
        userFriends.setCreatedBy(userId);
        userFriends.setCreatedOn(new Date());
        userFriends.setIsDelete(false);
        userFriends.setIsSaved(true);

        userFriendsRepository.save(userFriends);
        return ResponseUtil.generateSuccessResponse("Success to save " + friend.getName(), null, HttpStatus.CREATED);
    }

    public ResponseEntity<ApiResponse<Object>> listFriendRequest (HttpServletRequest request) {
        String token = tokenService.getTokenFromCookie(request.getCookies(), "access_token");
        List<Object> response = new ArrayList<>();;
        if (token.equals("token has no value")) {
            return ResponseUtil.generateSuccessResponse("Token is no value", token, HttpStatus.BAD_REQUEST);
        }

        Long userId = jwtService.extractUserId(token);

        List<UserFriends> listUserFriends = userFriendsRepository.findFriendRequest(userId);

        if (listUserFriends == null) {
            return ResponseUtil.generateSuccessResponse("User doesn't have friend request", listUserFriends);
        }

        for (UserFriends userFriend : listUserFriends) {
            Object user = userService.getProfile(userFriend.getUserId());
            if (user != null) {
                response.add(user);
            }
        }

        return ResponseUtil.generateSuccessResponse("Success to get friend request", response);
    }

    public ResponseEntity<ApiResponse<Object>> listFriends(HttpServletRequest request) {
        String token = tokenService.getTokenFromCookie(request.getCookies(), "access_token");
        List<Object> response = new ArrayList<>();;
        if (token.equals("token has no value")) {
            return ResponseUtil.generateSuccessResponse("Token is no value", token, HttpStatus.BAD_REQUEST);
        }

        Long userId = jwtService.extractUserId(token);

        if (userId == null) {
            return ResponseUtil.generateErrorResponse("User is not found",null, HttpStatus.NOT_FOUND);
        }

        List<UserFriends> userFriends = userFriendsRepository.findByUserId(userId);

        if (userFriends == null) {
            return ResponseUtil.generateSuccessResponse("User doesn't have friend", userFriends);
        }

         for (UserFriends userFriend : userFriends) {
            Object user = userService.getProfile(userFriend.getUserFriendId());
            if (user != null) {
                response.add(user);
            }
        }

        return ResponseUtil.generateSuccessResponse("Success to get friends", response);
    }
}
