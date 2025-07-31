package com.portofolio.talkify.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portofolio.talkify.service.FriendService;
import com.portofolio.talkify.service.JWTService;
import com.portofolio.talkify.utility.ApiResponse;
import com.portofolio.talkify.utility.ResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/friend")
public class ApiFriendController {

    @Autowired
    FriendService friendService;

    @Autowired
    JWTService jwtService;

    @Transactional
    @PostMapping("/searchFriend")
    public ResponseEntity<ApiResponse<Object>> searchFriend(@RequestBody Map<String, String> identity, HttpServletRequest request){
        try {
            String identityUser = identity.get("identity");
            return friendService.searchFriend(identityUser, request);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to access api", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PostMapping("/addFriend")
    public ResponseEntity<ApiResponse<Object>> addFriend(HttpServletRequest request, @RequestBody Map<String, String> identity){
        try {
            String identityUser = identity.get("identity");
            return friendService.addFriend(identityUser, request);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to add friend", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @GetMapping("/getFriendRequest")
    public ResponseEntity<ApiResponse<Object>> getFriendRequest(HttpServletRequest request) {
        try {
            return friendService.listFriendRequest(request);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Error ", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @GetMapping("/getFriend")
    public ResponseEntity<ApiResponse<Object>> getFriends(HttpServletRequest request){
        try {
            return friendService.listFriends(request);
        } catch (Exception e) {
            return ResponseUtil.generateErrorResponse("Failed to getFriend", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
